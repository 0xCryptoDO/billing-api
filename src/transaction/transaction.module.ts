import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingModule } from 'src/billing/billing.module';
import { Bill, BillSchema } from 'src/billing/schemas/bill.schema';
import { ContractApiService } from 'src/service-api/contract-api/contract-api.service';
import { Transaction, TransactionSchema } from './schemas';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Bill.name, schema: BillSchema },
    ]),
    BillingModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService, ContractApiService],
  exports: [TransactionService],
})
export class TransactionModule {}
