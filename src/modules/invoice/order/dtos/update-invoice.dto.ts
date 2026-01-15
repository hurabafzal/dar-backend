import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { EInvoiceStatus } from 'src/shared/enums/invoice-status.enum';

export class UpdateInvoiceDto {
  @ApiProperty({ description: 'Order ID', example: '64b71d3a9a7b6a29d6c3f3a5' })
  @IsMongoId()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ description: 'Total amount', example: 5000 })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ description: 'Paid amount', example: 1000 })
  @IsNumber()
  @IsOptional()
  paidAmount?: number;

  @ApiProperty({
    description: 'Status of the invoice',
    example: EInvoiceStatus.DESIGN_COMPLETED,
    enum: EInvoiceStatus,
  })
  @IsEnum(EInvoiceStatus)
  @IsOptional()
  status?: EInvoiceStatus;

  @ApiProperty({ 
    description: 'Construction status (automatically set based on status)', 
    example: 0 
  })
  @IsNumber()
  @IsOptional()
  construction?: number;
}
