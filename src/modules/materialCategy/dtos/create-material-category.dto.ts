import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTextureDto {
  @ApiProperty({
    description: 'Name of the texture',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsString()
  textureSrc?: string;

  @ApiProperty({
    description: 'Visibility of the texture for this material category',
  })
  @IsString()
  isVisible: string;

  @ApiProperty({
    description: 'Description of the texture',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'List of features for the texture (can be JSON string or array)',
    required: false,
    type: [String],
  })
  @IsOptional()
  features?: string[] | string;

  @ApiProperty({
    description: 'Technical specifications for the texture (can be JSON string or object)',
    required: false,
    type: Object,
  })
  @IsOptional()
  technicalSpecifications?: Record<string, string> | string;
  
  // Specific technical specifications fields from the image
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

export class CreateMaterialCategoryDto {
  @ApiProperty({
    example: 'DAR BASE',
    description: 'Name of the material category',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Colors of the material category',
  })
  @IsOptional()
  @IsArray()
  @Type(() => CreateTextureDto)
  textures?: CreateTextureDto[];

  @ApiProperty({
    description: 'Supplier material added to this material category',
  })
  @IsOptional()
  @IsArray()
  @Type(() => String)
  supplierMaterial?: string[];
}
