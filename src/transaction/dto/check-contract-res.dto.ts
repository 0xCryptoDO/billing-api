import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class CheckContractDto {
  @IsMongoId()
  @ApiProperty()
  contractId: string;
}
