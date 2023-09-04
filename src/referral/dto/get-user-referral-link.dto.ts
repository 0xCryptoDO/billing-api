import { ApiProperty } from '@nestjs/swagger';

export class GetUserReferralLinkResDto {
  @ApiProperty()
  referralLink: string;
}
