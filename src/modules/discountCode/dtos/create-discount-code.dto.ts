import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiscountCodeDto {
  @ApiProperty({ example: 'DAR50', description: 'Name of the discount code' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Discount percentage' })
  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @ApiProperty({
    example: '2025-01-20',
    description: 'Expiry date of the discount code',
  })
  @IsNotEmpty()
  @IsString()
  expiryDate: string;

  @ApiProperty({
    example: 'Dar 50% discount code',
    description: 'Description of the discount code',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
