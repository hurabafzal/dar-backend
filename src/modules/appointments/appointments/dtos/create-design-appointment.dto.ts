import { IsNotEmpty, IsString, IsDate, IsMongoId, IsOptional, IsEnum, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDesignAppointmentDto {
    @ApiProperty({ example: 'Living Room', description: 'Design Place' })
    @IsNotEmpty()
    @IsString()
    designPlace: string;

    @ApiProperty({ example: 'Interior', description: 'Design For' })
    @IsNotEmpty()
    @IsString()
    designFor: string;

    @ApiPropertyOptional({ example: '', description: 'Designer Id' })
    @IsNotEmpty()
    @IsString()
    designerId?: string;

    @ApiPropertyOptional({ example: '', description: 'Invoice Id' })
    @IsNotEmpty()
    @IsString()
    invoiceId?: string;
}
