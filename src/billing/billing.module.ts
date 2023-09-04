import { CacheModule, Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Bill, BillSchema } from './schemas';
import { UserApiService } from 'src/service-api/user-api/user-api.service';
import { RatesService } from './rates.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bill.name, schema: BillSchema }]),
    CacheModule.register(),
  ],
  providers: [BillingService, UserApiService, RatesService],
  controllers: [BillingController],
  exports: [BillingService],
})
export class BillingModule {}
