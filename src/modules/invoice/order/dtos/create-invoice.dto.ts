import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsString,
} from 'class-validator';
import { EInvoiceStatus } from 'src/shared/enums/invoice-status.enum';

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Order ID', example: '64b71d3a9a7b6a29d6c3f3a5' })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ description: 'Total amount', example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @ApiProperty({ description: 'Paid amount', example: 1000 })
  @IsNumber()
  @IsOptional()
  paidAmount: number;

  @ApiProperty({
    description: 'Status of the invoice',
    example: EInvoiceStatus.MEASUREMENT,
    enum: EInvoiceStatus,
  })
  @IsEnum(EInvoiceStatus)
  @IsOptional()
  status: EInvoiceStatus;

  @ApiProperty({ description: 'Charge ID', example: '64b71d3a9a7b6a29d6c3f3a5' })
  @IsString()
  @IsOptional()
  chargeId?: string;
}
