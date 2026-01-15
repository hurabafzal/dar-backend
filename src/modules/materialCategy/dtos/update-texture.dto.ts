import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTextureDto {
  @ApiProperty({
    description: 'ID of the material category',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    description: 'ID of the texture to update',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  textureId: string;

  @ApiProperty({
    description: 'New name of the texture',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Visibility of the texture',
    required: false,
  })
  @IsString()
  @IsOptional()
  isVisible?: string;

  @ApiProperty({
    description: 'Description of the texture',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of features for the texture (can be string or array)',
    required: false,
    type: [String],
  })
  @IsOptional()
  features?: string[] | string;

  @ApiProperty({
    description: 'Technical specifications for the texture',
    required: false,
    type: Object,
  })
  @IsOptional()
  technicalSpecifications?: Record<string, string>;

  @ApiProperty({
    description: 'Material type (e.g., Medium Density Fiberboard)',
    required: false,
  })
  @IsString()
  @IsOptional()
  materialType?: string;

  @ApiProperty({
    description: 'Surface finish (e.g., Laminate)',
    required: false,
  })
  @IsString()
  @IsOptional()
  surfaceFinish?: string;

  @ApiProperty({
    description: 'Thickness (e.g., 18mm)',
    required: false,
  })
  @IsString()
  @IsOptional()
  thickness?: string;

  @ApiProperty({
    description: 'Resistance level (e.g., Standard)',
    required: false,
  })
  @IsString()
  @IsOptional()
  resistance?: string;

  @ApiProperty({
    description: 'Typical application (e.g., Interior cabinetry)',
    required: false,
  })
  @IsString()
  @IsOptional()
  typicalApplication?: string;
}
