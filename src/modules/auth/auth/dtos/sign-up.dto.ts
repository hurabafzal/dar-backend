import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({example: 'john.doee@example.com', description: 'Enter email'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'password123', description: 'Enter password'})
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({example: 'Test user', description: 'Enter name'})
  @IsString()
  name: string;
}

