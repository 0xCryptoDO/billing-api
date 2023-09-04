import { Currencies } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';

class EarnedAmounts {
  @ApiProperty()
  [Currencies.bnb]: number;

  @ApiProperty()
  [Currencies.cdo]: number;

  @ApiProperty()
  [Currencies.busd]: number;
}

export class GetUserReferralInfoResDto {
  @ApiProperty()
  referralsCount: number;

  @ApiProperty()
  earned: EarnedAmounts;
}
