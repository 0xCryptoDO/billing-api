import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard, Roles, RolesGuard, SetRoles } from '@cryptodo/common';
import { TransactionService } from './transaction.service';
import {
  CheckContractDto,
  CreateTransactionDto,
  CreateTransactionParamsDto,
  CreatedTransactionResDto,
  VerifyPaymentDto,
} from './dto';
import { Reflector } from '@nestjs/core';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Success' })
  async verifyPayment(@Body() params: VerifyPaymentDto) {
    return this.transactionService.verifyPayment(params);
  }

  @Post('/:contractType')
  @ApiCreatedResponse({ type: CreatedTransactionResDto })
  async createTransaction(
    @Body() body: CreateTransactionDto,
    @Param() params: CreateTransactionParamsDto,
    @Request() req,
  ) {
    return this.transactionService.createTransaction(
      body,
      req.user.userId,
      params.contractType,
    );
  }

  @Get('/user/:userId')
  @SetRoles(Roles.internal)
  async getTransactions(@Param() param, @Request() req) {
    return this.transactionService.getUsersTransactions(param.userId);
  }

  @Get('/check/:contractId')
  @UseGuards(JwtAuthGuard, new RolesGuard(new Reflector()))
  @SetRoles(Roles.regular)
  checkContract(@Param() params: CheckContractDto) {
    return this.transactionService.checkContract(params);
  }

  @Get('/:id')
  @SetRoles(Roles.internal)
  async getTransactionById(@Param() params) {
    return this.transactionService.getTransactionByContractId(params.id);
  }
}
