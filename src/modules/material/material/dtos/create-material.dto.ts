import {
  IsString,
  IsEnum,
  IsNumber,
  IsObject,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PricesDto {
  @ApiProperty({ example: 70, description: 'Price for frame' })
  @IsNumber()
  frame: number;

  @ApiProperty({ example: 15, description: 'Price for shelves' })
  @IsNumber()
  shelves: number;

  @ApiProperty({ example: 17, description: 'Price for drawers' })
  @IsNumber()
  drawers: number;

  @ApiProperty({ example: 18, description: 'Price for doors' })
  @IsNumber()
  doors: number;
}

export class CreateMaterialDto {
  @ApiProperty({ example: 'Oak Wood', description: 'Name of the material' })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ['A', 'B', 'C', 'OTHER'],
    description: 'Category of the material',
  })
  @IsEnum(['A', 'B', 'C', 'OTHER'])
  category: string;

  @ApiProperty({
    type: PricesDto,
    description: 'Prices for different components',
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PricesDto)
  prices: PricesDto;

  @ApiProperty({
    example: 'KD',
    description: 'Unit for the price',
    required: true,
  })
  @IsString()
  priceUnit: string;

  @ApiProperty({
    example: true,
    description: 'Whether the material is available',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({
    example: 'High-quality oak wood',
    description: 'Description of the material',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/oak-wood.jpg',
    description: 'URL of the material image',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: 'Material Category ID', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;
}
