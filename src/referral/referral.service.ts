import { ConfigService } from '@nestjs/config';
import { Currencies, currencies, ICurrency } from '@cryptodo/billing';
import { Injectable, NotFoundException } from '@nestjs/common';
import { formatEther, formatUnits } from 'ethers/lib/utils';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  GetReferralUserWalletResDto,
  GetUserReferralInfoResDto,
  GetUserReferralLinkResDto,
} from './dto';
import {
  referralLinkTemplate,
  defaultReferralWallet,
} from './referral.constants';
import { Base64 } from 'js-base64';
import { BigNumberish } from 'ethers';
import { UserApiService } from 'src/service-api/user-api';

@Injectable()
export class ReferralService {
  constructor(
    private transactionService: TransactionService,
    private configService: ConfigService,
    private userApiService: UserApiService,
  ) {}
  private isProduction =
    this.configService.get('NODE_ENV', { infer: true }) === 'production';

  private async getReferralsCount(wallet: string): Promise<number> {
    const referralsCount =
      await this.transactionService.paymentsContract.getReferralsNumbers(
        wallet,
      );
    return referralsCount[1].toNumber();
  }

  private async getEarnedBnbAmount(wallet: string): Promise<number> {
    const earnedAmount =
      await this.transactionService.paymentsContract.getearnedAmountBNB(wallet);
    return +formatEther(earnedAmount);
  }

  private async getEarnedErc20Amount(
    tokens: ICurrency[],
    wallet: string,
  ): Promise<number[]> {
    const addresses = tokens.map((currency) => {
      return this.isProduction ? currency.mainnet : currency.testnet;
    });
    const earnedAmounts: BigNumberish[] =
      await this.transactionService.paymentsContract.getearnedAmountToken(
        wallet,
        addresses,
      );
    return earnedAmounts.map(
      (amount, i) => +formatUnits(amount, tokens[i].decimals),
    );
  }

  public async getUserReferralInfo(
    userId: string,
  ): Promise<GetUserReferralInfoResDto> {
    const user = await this.userApiService.getById(userId);
    if (!user) {
      throw new NotFoundException(null, `user ${userId} does not exists`);
    }
    const referralsCount = await this.getReferralsCount(user.wallet);
    const bnbEarnedAmount = await this.getEarnedBnbAmount(user.wallet);
    const erc20EarnedAmount = await this.getEarnedErc20Amount(
      [currencies.CDO, currencies.BUSD],
      user.wallet,
    );
    return {
      referralsCount,
      earned: {
        [Currencies.bnb]: bnbEarnedAmount,
        [Currencies.cdo]: erc20EarnedAmount[0],
        [Currencies.busd]: erc20EarnedAmount[1],
      },
    };
  }

  public async getUserReferralLink(
    userId: string,
  ): Promise<GetUserReferralLinkResDto> {
    return { referralLink: referralLinkTemplate + Base64.encode(userId) };
  }

  public async getReferralUserWallet(
    userId: string,
  ): Promise<GetReferralUserWalletResDto> {
    const user = await this.userApiService.getById(userId);

    if (!user) {
      throw new NotFoundException(null, `user ${userId} does not exists`);
    }

    if (!user.referralUserId) {
      return { referralUserWallet: defaultReferralWallet };
    }

    const referralUser = await this.userApiService.getById(user.referralUserId);

    if (!referralUser) {
      throw new NotFoundException(
        null,
        `referral user ${user.referralUserId} does not exists`,
      );
    }

    return { referralUserWallet: referralUser.wallet };
  }
}
