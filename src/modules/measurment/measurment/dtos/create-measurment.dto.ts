import {
  IsString,
  IsObject,
  IsOptional,
  ValidateNested,
  IsArray,
  ValidateIf,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { EMeasurementType } from 'src/shared/enums/measurement-type.enum';

export class LineItemDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class FileDto {
  @ApiProperty()
  @IsString()
  originalName: string;

  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  mimeType: string;

  @ApiProperty()
  @IsString()
  path: string;
}

export class CreateMeasurmentDto {
  @ApiProperty({
    example: 'First neasurment',
    description: 'Name of the measurment',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '40*60*20', description: 'Measurment taken' })
  @IsString()
  @IsOptional()
  measurment?: string;

  @ApiProperty({ example: '12-12-2024', description: 'Measurment taken' })
  @IsString()
  @IsOptional()
  measurementDate?: Date;

  @ApiProperty({
    example: 'Comments about measurment',
    description: 'Measurment taken',
    required: false,
  })
  @IsOptional()
  @IsString()
  comments?: string;

  @ApiProperty({
    example: 'Design',
    enum: EMeasurementType,
    description: 'Type of the measurement (Design or Measurement)',
  })
  @IsEnum(EMeasurementType)
  type: EMeasurementType;

  // @ApiProperty({
  //   description: 'Line items for different components',
  // })
  // @IsArray()
  // @ValidateNested()
  // @Type(() => LineItemDto)
  // @IsOptional()
  // lineItems?: any;

  @ApiProperty({
    description:
      'Line items for different components, can be a string or an array of LineItemDto',
  })
  @ValidateIf(
    (obj) => typeof obj.lineItems === 'string' || Array.isArray(obj.lineItems),
  )
  @IsOptional()
  lineItems?: string | LineItemDto[];

  @ApiProperty({
    description: 'Uploaded files related to meeasurments',
    required: false,
  })
  // @IsArray()
  @IsOptional()
  files?: any[];

  @ApiProperty({
    description: 'Customer Id who is requesting the measurment',
  })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({
    example: 'chg_TS06A2620252138Kw2k0601606',
    description: 'Customer Id who is requesting the measurement',
  })
  @IsOptional()
  @IsString()
  chargeId?: string;
}
