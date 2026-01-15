import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateSmsDto {
  @ApiProperty({ example: 'SMS001', description: 'The unique identifier for the SMS' })
  @IsNotEmpty()
  @IsString()
  smsId: string;

  @ApiProperty({ example: 'WELCOME', description: 'The code for the SMS' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  smsCode: string;

  @ApiProperty({ example: 'Welcome to our service!', description: 'The SMS content in English' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  smsContentE: string;

  @ApiProperty({ example: 'مرحبا بكم في خدمتنا!', description: 'The SMS content in Arabic' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  smsContentA: string;
}

