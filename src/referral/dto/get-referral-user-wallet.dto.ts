import { ApiProperty } from '@nestjs/swagger';

export class GetReferralUserWalletResDto {
  @ApiProperty()
  referralUserWallet: string;
}
