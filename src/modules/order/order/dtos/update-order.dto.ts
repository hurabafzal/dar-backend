import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    description: 'Uploaded files related to measurements',
    required: false,
  })
  @IsOptional()
  existingFiles?: string;
}
