import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserGroupsDto {
  @ApiProperty({ example: 1, description: 'The unique identifier for the groupId' })
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @ApiProperty({ example: "demo name", description: 'The name for groupNameEn' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  groupNameEn: string;

  @ApiProperty({ example: "temp name", description: 'The name for the groupNameAr' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  groupNameAr: string;
}
