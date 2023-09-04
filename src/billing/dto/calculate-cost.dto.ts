import { ContractType, Network, Currencies } from '@cryptodo/contracts';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';

export class CalculateCostDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(ContractType)
  @ApiProperty({ enum: ContractType })
  type: ContractType;

  @IsString()
  @IsEnum(Currencies)
  @IsNotEmpty()
  @ApiProperty({ type: String, enum: Currencies })
  currency: Currencies;

  @IsString()
  @IsEnum(Network)
  @IsNotEmpty()
  @ApiProperty({ type: String, enum: Network })
  network: Network;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String], required: false })
  options: string[];
}

export class CalculateCostResDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  options: { [key: string]: number };

  @ApiProperty({ required: false })
  usdEq?: number;
}
