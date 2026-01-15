import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteTextureDto {
  @ApiProperty({
    description: 'ID of the material category',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'ID of the texture to delete',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  textureId: string;
}
