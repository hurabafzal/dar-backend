import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetTextureDto {
  @ApiProperty({
    description: 'ID of the material category',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Texture ID to retrieve',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  textureId: string;
}
