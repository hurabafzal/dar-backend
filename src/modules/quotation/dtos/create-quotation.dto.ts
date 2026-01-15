import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsString,
  IsArray,
} from 'class-validator';
import { EQuotationStatus } from 'src/shared/enums/quotation-status.enum';

export class CreateQuotationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsArray()
  @IsNotEmpty()
  items: Array<{
    item: string;
    description: string;
    price: string;
    quantity?: string;
    amount?: string;
  }>;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsNumber()
  @IsOptional()
  grossAmount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsEnum(EQuotationStatus)
  @IsOptional()
  status?: EQuotationStatus;

  // OPTIONAL:
  @IsMongoId()
  @IsOptional()
  orderId?: string;

  @IsString()
  @IsOptional()
  comments?: string;
}