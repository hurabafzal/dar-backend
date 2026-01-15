import {
  IsString,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ComponentDto {
  @ApiProperty({ example: 1, description: 'The count of the component' })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    example: 'Cleaf',
    description: 'The material of the component',
  })
  @IsString()
  @IsNotEmpty()
  material: string;
}

export class CreateModelDto {
  @ApiProperty({
    example: 'df357675-c66d-4807-97df-31f6c91b853a',
    description: 'The id of the model',
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ example: 'Cabinet1', description: 'The count of the model' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    type: ComponentDto,
    description: 'Details of the frame component',
  })
  @ValidateNested()
  @Type(() => ComponentDto)
  frame?: ComponentDto;

  @ApiProperty({
    type: ComponentDto,
    description: 'Details of the door component',
  })
  @ValidateNested()
  @Type(() => ComponentDto)
  door?: ComponentDto;

  @ApiProperty({
    type: ComponentDto,
    description: 'Details of the drawer component',
  })
  @ValidateNested()
  @Type(() => ComponentDto)
  drawer?: ComponentDto;

  @ApiProperty({
    type: ComponentDto,
    description: 'Details of the drawer component',
  })
  @ValidateNested()
  @Type(() => ComponentDto)
  shelf?: ComponentDto;
}
