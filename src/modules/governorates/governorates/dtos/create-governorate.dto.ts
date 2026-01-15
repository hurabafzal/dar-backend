import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGovernorateDto {
  @ApiProperty({example: "New Governorate", description: "Add a new governorate"})
  @IsNotEmpty()
  @IsString()
  name: string;
}
