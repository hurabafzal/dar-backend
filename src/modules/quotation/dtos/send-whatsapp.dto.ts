import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SendWhatsAppDto {
  @ApiProperty({ 
    example: '64f7b1234567890abcdef123', 
    description: 'The quotation ID to send via WhatsApp' 
  })
  @IsNotEmpty()
  @IsString()
  quotationId: string;

  @ApiProperty({ 
    example: '+96512345678', 
    description: 'Customer phone number (optional - will use quotation phone if not provided)' 
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ 
    example: 'Custom message for the customer', 
    description: 'Optional custom message to include' 
  })
  @IsOptional()
  @IsString()
  customMessage?: string;
}