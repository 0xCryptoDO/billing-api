import { ContractType, Network } from '@cryptodo/contracts';
import { Currencies, TransactionStatus } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Transaction } from '../schemas';

export class CreateTransactionDto {
  @IsString()
  @IsEnum(Object.values(Currencies).filter((v) => v !== Currencies.usd))
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    enum: Object.values(Currencies).filter((v) => v !== Currencies.usd),
  })
  currency: Currencies;

  @IsString()
  @IsEnum(Object.values(Network))
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    enum: Object.values(Network),
  })
  network: Network;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  contractId: string;
}

export class CreatedTransactionResDto implements Transaction {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  payableAmount: number;

  @ApiProperty({
    type: String,
    enum: Object.values(Currencies).filter((v) => v !== Currencies.usd),
  })
  currency: Currencies;

  @ApiProperty({
    type: String,
    enum: Object.values(Network),
  })
  network: Network;

  @ApiProperty()
  contractId: string;

  @ApiProperty({ type: String, enum: TransactionStatus })
  status: TransactionStatus;
}

export class CreateTransactionParamsDto {
  @IsEnum(ContractType)
  @IsNotEmpty()
  @ApiProperty({ enum: ContractType })
  contractType: ContractType;
}
