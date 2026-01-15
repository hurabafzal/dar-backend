import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  Min,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID of the associated order',
    example: '64d8f63b6e7eaf0012345678',
  })
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    description: 'ID of the associated product',
    example: '64d8f63b6e7eaf0012345679',
  })
  @IsMongoId()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    description: 'Quantity of the product',
    example: '5',
  })
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Item Description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsBoolean()
  isAdditional?: boolean;
}
