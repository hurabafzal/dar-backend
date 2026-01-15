import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateItemDto {
  @ApiProperty({
    example: 'Bed',
    description: 'Name of the item',
    required: false,
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price of the item', required: false })
  @IsOptional()
  @IsNumber()
  price: number;
}
