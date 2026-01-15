import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { EOrderStatus } from 'src/shared/enums/order-status.enum';
import { EPaymentTerms } from 'src/shared/enums/payment-terms.enum';
import { EUserType } from 'src/shared/enums/user-type.enum';

class OrderItemDto {
  @ApiProperty({ description: 'ID of the item', example: '64b6fbd0d1fcd3b4f0e61234' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Name item', example: 'Bed' })
  @IsString()
  @IsNotEmpty()
  item: string;

  @ApiProperty({ description: 'Quantity of the item', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({ description: 'Price of the item', example: 2 })
  @IsOptional()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Total Amount', example: 20 })
  @IsNumber()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ description: 'description of the item', example: 2 })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Status of the item', example: 'PENDING' })
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Whether this is an additional item', example: false })
  @IsOptional()
  @IsBoolean()
  isAdditional?: boolean;
}

export class CreateOrderDto {
  @ApiPropertyOptional({ description: 'Customer ID', example: '64b6fbd0d1fcd3b4f0e61234', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Supplier ID', example: '64b6fbd0d1fcd3b4f0e61234', required: false })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Measurement ID', example: '64b6fbd0d1fcd3b4f0e61234', required: false })
  @IsOptional()
  @IsString()
  measurementId?: string;

  @ApiPropertyOptional({ description: 'description of the measurement', example: 2 })
  @IsOptional()
  @IsString()
  measurementDescription?: string;

  @ApiProperty({
    description: 'Order status',
    example: EOrderStatus.SAVED,
    enum: EOrderStatus,
  })
  @IsEnum(EOrderStatus)
  status: EOrderStatus;

  @ApiProperty({
    description: 'User status',
    example: EUserType.CUSTOMER,
    enum: EUserType,
  })
  @IsEnum(EUserType)
  userType: EUserType;
  
  @ApiPropertyOptional({
    description: 'Payment terms',
    example: EPaymentTerms.FORTY_FORTY_TWENTY,
    enum: EPaymentTerms,
  })
  @IsOptional()
  @IsEnum(EPaymentTerms)
  paymentTerms?: EPaymentTerms;

  @ApiPropertyOptional({ description: 'Reference Number', example: 'REF12345' })
  @IsOptional()
  @IsString()
  referenceNo?: string;

  @ApiPropertyOptional({ description: 'Comments', example: 'Test Comment' })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiPropertyOptional({
    description: 'Estimated Delivery Date',
    example: '2024-12-15',
  })
  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: Date;

  @ApiPropertyOptional({
    description: 'Invoice Date',
    example: '2024-12-15',
  })
  @IsOptional()
  @IsDateString()
  invoiceDate?: Date;

  @ApiProperty({ description: 'Gross Amount', example: 100 })
  @IsNotEmpty()
  @IsString()
  grossAmount: string;

  @ApiProperty({ description: 'Total Amount', example: 1000 })
  @IsNotEmpty()
  @IsString()
  totalAmount: string;

  @ApiProperty({ description: 'Discount', example: 20 })
  @IsNotEmpty()
  @IsString()
  discount: string;

  @ApiProperty({ description: 'Invoice Type', example: 'Measurement' })
  @IsNotEmpty()
  @IsString()
  invoiceType: string;

  @ApiProperty({
    description: 'List of items in the order',
    type: [OrderItemDto],
  })
  @IsOptional()
  items: OrderItemDto[];

  @ApiProperty({
    description: 'Uploaded files related to order',
    required: false,
  })
  @IsOptional()
  files?: any[];

  @ApiProperty({ description: 'Order Type', example: 'Platform' })
  @IsOptional()
  @IsString()
  orderType: string;

  @ApiPropertyOptional({
    description: 'Whether this is an additional item',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isAdditional?: boolean;
}
