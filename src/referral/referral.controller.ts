import { JwtAuthGuard, RolesGuard } from '@cryptodo/common';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GetReferralUserWalletResDto,
  GetUserReferralInfoResDto,
  GetUserReferralLinkResDto,
} from './dto';
import { ReferralService } from './referral.service';

@ApiTags('referral')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@Controller('referral')
export class ReferralController {
  constructor(private referralService: ReferralService) {}
  @Get('/statistics')
  @ApiOkResponse({ type: GetUserReferralInfoResDto })
  getUserReferralInfo(@Request() req): Promise<GetUserReferralInfoResDto> {
    return this.referralService.getUserReferralInfo(req.user.userId);
  }

  @Get('/link')
  @ApiOkResponse({ type: GetUserReferralLinkResDto })
  getUserReferralLink(@Request() req): Promise<GetUserReferralLinkResDto> {
    return this.referralService.getUserReferralLink(req.user.userId);
  }

  @Get('/wallet')
  @ApiOkResponse({ type: GetReferralUserWalletResDto })
  getReferralUserWallet(@Request() req): Promise<GetReferralUserWalletResDto> {
    return this.referralService.getReferralUserWallet(req.user.userId);
  }
}
