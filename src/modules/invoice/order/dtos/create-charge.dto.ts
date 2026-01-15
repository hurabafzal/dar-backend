import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateChargeeDto {
  @ApiProperty({ description: 'Amount', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Customer Id' })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ description: 'Order Id' }) 
  @IsString()                               
  @IsNotEmpty()                             
  orderId: string;                          

  @ApiProperty({ description: 'Design Id' })
  @IsString()
  @IsOptional()
  designId?: string;

  @ApiProperty({ description: 'Invoice Type' })
  @IsString()
  @IsNotEmpty()
  invoiceType: string;
}