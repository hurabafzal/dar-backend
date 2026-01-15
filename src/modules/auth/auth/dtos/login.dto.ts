import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({example: "john.doe@example.com", description: "Email for login"})
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({example: "3214354657", description: "Phone for login"})
  @IsOptional()
  phone?: string;

  @ApiProperty({example: "password123", description: "testing description"})
  @IsString()
  password: string;
}

