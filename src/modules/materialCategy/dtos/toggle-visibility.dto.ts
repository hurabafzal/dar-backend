import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ToggleVisibilityDto {
  @ApiProperty({
    description: 'Id of the category',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Name of the texture',
  })
  @IsString()
  textureName: string;
}
