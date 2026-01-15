import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';
import { ELanguage } from 'src/shared/enums/language.enum';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Customer name in English', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  custNameE: string;

  @ApiProperty({ description: 'Customer name in Arabic', maxLength: 50 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  custNameA: string;

  @ApiProperty({ description: 'Mobile Number', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  mobileNumber: string;

  @ApiProperty({ description: 'Phone number', maxLength: 20 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ description: 'Email address', maxLength: 100 })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @ApiProperty({ description: 'Customer address', maxLength: 2000, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  address: string;

  @ApiProperty({ description: 'Display status (1 for show, 0 for hide)', default: 1 })
  @IsOptional()
  show?: number;

  @ApiProperty({ description: 'Preferred language', required: false })
  @IsNotEmpty()
  @IsString()
  preferredLanguage: ELanguage;
}
