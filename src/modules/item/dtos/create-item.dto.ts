import {
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ example: 'Bed', description: 'Name of the item' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Price of the item' })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
