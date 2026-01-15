import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { ELanguage } from 'src/shared/enums/language.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    description: 'The user ID (username) of the user',
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  userId: string;

  @ApiProperty({
    example: 1,
    description: 'The group code the user belongs to',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  groupId: number;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  userName: string;

  @ApiProperty({
    example: 'اختبار المستخدم',
    description: 'Arabic name of the user',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  userNameAr: string;

  @ApiProperty({
    example: '1234567890',
    description: "The user's phone number",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(8)
  phone?: string;

  @ApiProperty({
    example: 'English',
    description: "The user's preferred language (single character code)",
    required: false,
  })
  @IsOptional()
  @IsString()
  preferredLanguage?: ELanguage;

  @ApiProperty({
    example: false,
    description: 'Whether the user account is disabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  disabled?: boolean;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'Supplier Address',
    description: 'The Address of the Supplier',
  })
  @IsOptional()
  address: string;
}
