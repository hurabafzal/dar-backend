import { IsBoolean, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlockDateDto {
  @ApiProperty({
    example: '2024-12-12',
    description: 'The start date for the block date range',
  })
  @IsString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    example: '2024-12-15',
    description: 'The end date for the block date range',
  })
  @IsString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    example: true,
    description: 'Whether design is available during this block',
    default: false,
  })
  @IsBoolean()
  design: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether measurement is available during this block',
    default: false,
  })
  @IsBoolean()
  measurement: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether delivery is available during this block',
    default: false,
  })
  @IsBoolean()
  delivery: boolean;
}
