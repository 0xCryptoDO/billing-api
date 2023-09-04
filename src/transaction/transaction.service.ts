import { TransactionDocument, Transaction } from './schemas/transaction.schema';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { formatEther } from 'ethers/lib/utils';
import { BillingService } from 'src/billing/billing.service';
import { Web3Payments } from 'web3-payments';
import {
  networkCurrencies,
  paymentsContracts,
  rpcUrls,
  TransactionStatus,
} from '@cryptodo/contracts';
import { abi } from './assets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CheckContractDto,
  CreateTransactionDto,
  VerifyPaymentDto,
} from './dto';
import { ContractType, IERC20Contract } from '@cryptodo/contracts';
import { Bill, BillDocument } from '../billing/schemas/bill.schema';
import { formatUnits } from 'ethers/lib/utils';
import { ContractApiService } from 'src/service-api/contract-api';
import { ethers } from 'ethers';
import { bscRpcUrl, contracts } from './transaction.constants';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    @InjectModel(Bill.name)
    private billModel: Model<BillDocument>,
    private billingService: BillingService,
    private configService: ConfigService,
    private contractApiService: ContractApiService,
  ) {}

  private isProduction =
    this.configService.get('NODE_ENV', { infer: true }) === 'production';

  //todo:  remove this
  private bscRpcProvider = new ethers.providers.JsonRpcProvider(
    this.isProduction ? bscRpcUrl.mainnet : bscRpcUrl.testnet,
  );
  private async checkExistenceOfTransaction(hash: string): Promise<boolean> {
    const tx = await this.transactionModel.exists({ hash });
    return !!tx;
  }

  //todo: remove this
  public paymentsContract = new ethers.Contract(
    this.isProduction ? contracts.payments.mainnet : contracts.payments.testnet,
    abi,
    this.bscRpcProvider,
  );

  public async createTransaction(
    params: CreateTransactionDto,
    userId: string,
    contractType: ContractType,
  ) {
    const contract: IERC20Contract =
      await this.contractApiService.getContractById(
        params.contractId,
        contractType,
      );
    if (!contract) {
      throw new NotFoundException(
        null,
        `contract ${params.contractId} does not exists`,
      );
    }
    const options = Object.keys(contract?.options || {}).filter(
      (key) => contract.options[key],
    );
    const cost = await this.billingService.calculateCost(
      {
        type: contractType,
        currency: params.currency,
        options: options,
        network: params.network,
      },
      userId,
    );
    const tx = await this.transactionModel.findOneAndUpdate(
      { contractId: params.contractId },
      {
        $setOnInsert: { contractId: params.contractId },
        payableAmount: cost.total,
        currency: params.currency,
        network: params.network,
      },
      { new: true, upsert: true },
    );
    await this.billingService.pushTxIfNotExists(tx.id, userId);
    return tx;
  }

  public async verifyPayment(params: VerifyPaymentDto) {
    const transaction = await this.transactionModel.findById(
      params.transactionId,
    );
    if (!transaction) {
      throw new NotFoundException(
        null,
        `Transaction ${params.transactionId} does not exists`,
      );
    }
    if (transaction.status === TransactionStatus.paid) {
      throw new ConflictException(
        null,
        `Payment for transaction ${transaction.id} has already been made`,
      );
    }
    const web3Payments = new Web3Payments({
      abi,
      recipientWallet: this.isProduction
        ? paymentsContracts[transaction.network].mainnet
        : paymentsContracts[transaction.network].testnet,
      rpcProviderUrl: this.isProduction
        ? rpcUrls[transaction.network].mainnet
        : rpcUrls[transaction.network].testnet,
      checkPaymentAvialability: async (tx) => {
        const result = await this.checkExistenceOfTransaction(tx.hash);
        return !result;
      },
    });
    const result = await web3Payments
      .verifyPayment(params.hash, 30000)
      .catch((err) => {
        if (err.code === 'INVALID_ARGUMENT') {
          throw new BadRequestException(null, 'Invalid txHash');
        }
        if (err.code === 'TIMEOUT') {
          throw new NotFoundException(
            null,
            'Transaction not found or being processed',
          );
        }
        if (
          err.details?.errCode === 'CONFLICT_ADDR' ||
          err.details?.errCode === 'UNAVAILABLE'
        ) {
          throw new ConflictException(null, err.message);
        }
      });
    if (!result) {
      throw new NotFoundException(
        null,
        'Transaction not found or being processed',
      );
    }
    if (!result.sucess) {
      throw new HttpException(
        'Transaction failed',
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
    const transferAmount = networkCurrencies[transaction.network][
      transaction.currency
    ]
      ? formatUnits(
          result.decodedData?.amount,
          networkCurrencies[transaction.network][transaction.currency].decimals,
        )
      : formatEther(result.tx.value);
    const decimals =
      networkCurrencies[transaction.network][transaction.currency] &&
      networkCurrencies[transaction.network][transaction.currency].decimals
        ? networkCurrencies[transaction.network][transaction.currency].decimals
        : 18;
    if (
      Math.abs(+transferAmount - transaction.payableAmount) >
      10 ** -decimals
    ) {
      throw new ConflictException(
        null,
        `Transfer amount is less than ${transaction.payableAmount}${transaction.currency}`,
      );
    }
    await transaction.updateOne({
      hash: result.tx.hash,
      receipt: result.receipt,
      status: TransactionStatus.paid,
    });
  }

  public async getTransactionByContractId(contractId: string) {
    return this.transactionModel.findOne({ contractId }).lean();
  }

  public async getUsersTransactions(userId: string) {
    let bill = await this.billModel.findOne({ userId }).lean();
    if (!bill) {
      bill = await this.billModel.create({ userId });
    }
    return this.transactionModel
      .find(
        { _id: { $in: bill.transactions } },
        { _id: 0, contractId: 1, status: 1 },
      )
      .lean();
  }

  public async checkContract(params: CheckContractDto) {
    const transaction = await this.transactionModel
      .findOne({
        contractId: params.contractId,
      })
      .lean();
    if (!transaction) {
      return false;
    }
    if (transaction.status === TransactionStatus.paid) {
      return true;
    } else {
      return false;
    }
  }
}
