import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsBoolean, MaxLength, IsOptional } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 1, description: 'The unique identifier for the menu item' })
  @IsNotEmpty()
  @IsNumber()
  menuId: number;

  @ApiProperty({ example: 0, description: 'The parent menu ID (0 for root level items)', required: false })
  @IsOptional()
  @IsNumber()
  parentMenuId?: number;

  @ApiProperty({ example: 'Dashboard', description: 'The English name of the menu item' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  menuNameEn: string;

  @ApiProperty({ example: 'لوحة القيادة', description: 'The Arabic name of the menu item' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  menuNameAr: string;

  @ApiProperty({ example: '/dashboard', description: 'The URL of the page this menu item links to', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  pageUrl?: string;

  @ApiProperty({ example: 'dashboard', description: 'The icon name for the menu item', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ example: 1, description: 'The order in which this menu item should appear' })
  @IsNotEmpty()
  @IsNumber()
  orderBy: number;

  @ApiProperty({ example: true, description: 'Whether this menu item should be visible', required: false })
  @IsOptional()
  @IsBoolean()
  show?: boolean;
}

