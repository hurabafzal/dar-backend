import { IsObject, IsNumber, IsOptional, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum Category {
  A = 'A',
  B = 'B',
  C = 'C',
  OTHER = 'OTHER'
}

class ComponentCountDto {
  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  doors?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  frame?: number;

  @ApiProperty({ required: false, example: 3 })
  @IsOptional()
  @IsNumber()
  shelves?: number;

  @ApiProperty({ required: false, example: 2 })
  @IsOptional()
  @IsNumber()
  drawers?: number;
}

class CategoryDto {
  @ApiProperty({ enum: Category, enumName: 'Category' })
  @IsEnum(Category)
  category: Category;

  @ApiProperty({ type: ComponentCountDto })
  @ValidateNested()
  @Type(() => ComponentCountDto)
  components: ComponentCountDto;
}

export class CalculatePriceDto {
  @ApiProperty({ type: [CategoryDto] })
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories: CategoryDto[];
}

