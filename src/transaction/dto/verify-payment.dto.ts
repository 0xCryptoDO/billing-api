import { ApiProperty } from '@nestjs/swagger';
import { IsHexadecimal, IsMongoId, IsNotEmpty } from 'class-validator';
export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  transactionId: string;

  @IsNotEmpty()
  @IsHexadecimal()
  @ApiProperty()
  hash: string;
}
