import { IsOptional, IsNumber, IsMongoId, Min, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrderItemDto {
  @ApiPropertyOptional({
    description: 'ID of the associated order',
    example: '64d8f63b6e7eaf0012345678',
  })
  @IsMongoId()
  @IsOptional()
  orderId?: string;

  @ApiPropertyOptional({
    description: 'ID of the associated product',
    example: '64d8f63b6e7eaf0012345679',
  })
  @IsMongoId()
  @IsOptional()
  itemId?: string;

  @ApiPropertyOptional({
    description: 'Quantity of the product',
    example: 10,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isAdditional?: boolean;
}
