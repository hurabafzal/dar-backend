import { IsString, IsNumber, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

enum ComponentType {
  Frame = 'Frame',
  Door = 'Door',
  Drawer = 'Drawer',
  Shelf = 'Shelf'
}

export class UpdateModelDto {
  @ApiProperty({ example: 'Cabinet1', description: 'The name of the model' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'c63ac409-6e45-4e17-b6db-ccc5f4a77528',
    description: 'The UUID of the model',
  })
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @ApiProperty({ enum: ComponentType, description: 'The component to update' })
  @IsEnum(ComponentType)
  @IsNotEmpty()
  component: ComponentType;

  @ApiProperty({ example: 1, description: 'The count of the component' })
  @IsNumber()
  @IsNotEmpty()
  count: number;

  @ApiProperty({
    example: 'Atlas',
    description: 'The material of the component',
  })
  @IsString()
  @IsNotEmpty()
  material: string;
}
