import { Module } from '@nestjs/common';
import { ContractApiService } from './contract-api/contract-api.service';
import { UserApiService } from './user-api/user-api.service';

@Module({
  providers: [UserApiService, ContractApiService],
})
export class ServiceApiModule {}
