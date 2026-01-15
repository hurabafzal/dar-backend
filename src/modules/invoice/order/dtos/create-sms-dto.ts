import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSmsDto {
  @ApiProperty({ description: 'Customer phone number', example: '123456789' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Invoice amount', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Invoice charge url' })
  @IsString()
  @IsNotEmpty()
  chargeUrl: string;
}
