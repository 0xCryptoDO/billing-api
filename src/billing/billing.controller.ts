import { JwtAuthGuard, RolesGuard } from '@cryptodo/common';
import { Query, Req, UseGuards } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { CalculateCostDto, CalculateCostResDto } from './dto';
import { Reflector } from '@nestjs/core';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@Controller('billing')
export class BillingController {
  constructor(private billingService: BillingService) {}

  @Get('/cost')
  @ApiOkResponse({
    type: CalculateCostResDto,
    description: 'Cost and currency for payment',
  })
  calculateCost(@Query() query: CalculateCostDto, @Req() req) {
    return this.billingService.calculateCost(query, req.user.userId);
  }
}
