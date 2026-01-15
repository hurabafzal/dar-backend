import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({example: "New District", description: "Add a district name"})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({example: "6751b316294a6f3cd83ac81e", description: "Add a existing governorate id"})
  @IsNotEmpty()
  @IsMongoId()
  governorateId: string;
}

