import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

class ChildObjectInfo {
  @ApiProperty({
    example: 1,
    description: 'Number of frames in the model',
  })
  @IsInt()
  Frame: number;

  @ApiProperty({
    example: 2,
    description: 'Number of shelves in the model',
  })
  @IsInt()
  Shelf: number;

  @ApiProperty({
    example: 2,
    description: 'Number of drawers in the model',
  })
  @IsInt()
  Drawer: number;

  @ApiProperty({
    example: 2,
    description: 'Number of doors in the model',
  })
  @IsInt()
  Door: number;
}

class MaterialInfo {
  @ApiProperty({
    example: 1,
    description: 'Material of Frames in the model',
  })
  @IsString()
  Frame: string;

  @ApiProperty({
    example: 2,
    description: 'Material of shelves in the model',
  })
  @IsString()
  Shelf: string;

  @ApiProperty({
    example: 2,
    description: 'Material of Drawers in the model',
  })
  @IsString()
  Drawer: string;

  @ApiProperty({
    example: 2,
    description: 'Material of Doors in the model',
  })
  @IsString()
  Door: string;
}

export class CreateDesignModelDto {
  @ApiProperty({
    example: 'cabinet1',
    description: 'ID of the model',
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: 'cabinets',
    description: 'Category of the model',
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: 'Cabinet 1',
    description: 'Name of the model',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: "Url of model's thumbnail",
  })
  thumbnailSrc: Express.Multer.File;

  @ApiProperty({
    description: 'Url of the model',
  })
  modelUrl: Express.Multer.File;

  @ApiProperty({
    example: 20,
    description: 'Width of the model',
  })
  @IsString()
  width: string;

  @ApiProperty({
    example: 20,
    description: 'Height of the model',
  })
  @IsString()
  height: string;

  @ApiProperty({
    example: 20,
    description: 'Depth of the model',
  })
  @IsString()
  depth: string;

  @ApiProperty({
    description: 'Depth of the model',
  })
  childObjInfo: string;

  // @ApiProperty({
  //   example: 20,
  //   description: 'Depth of the model',
  // })
  // @Type(() => MaterialInfo)
  // materialInfo: MaterialInfo;
}
