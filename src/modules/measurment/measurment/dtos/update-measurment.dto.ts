import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMeasurmentDto } from './create-measurment.dto';
import { IsOptional } from 'class-validator';

export class UpdateMeasurmentDto extends PartialType(CreateMeasurmentDto) {
  @ApiProperty({
    description: 'Uploaded files related to measurements',
    required: false,
  })
  @IsOptional()
  existingFiles?: string;
}
