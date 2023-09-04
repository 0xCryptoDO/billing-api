import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserApiService } from 'src/service-api/user-api/user-api.service';

@Module({
  imports: [TransactionModule],
  providers: [ReferralService, UserApiService],
  controllers: [ReferralController],
})
export class ReferralModule {}
