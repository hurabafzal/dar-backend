import { IsNotEmpty, IsString, IsDate, IsMongoId, IsOptional, IsEnum, IsNumber, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AppointmentType } from 'src/shared/enums/appointments.enum';
import { CreateDesignAppointmentDto } from './create-design-appointment.dto';

export class CreateAppointmentDto {
  @ApiProperty({ example: '674dffaab7dbc0c87b852313', description: 'Customer ID' })
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @ApiProperty({ enum: AppointmentType, example: AppointmentType.MEASUREMENT, description: 'Appointment type' })
  @IsNotEmpty()
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @ApiProperty({ example: '12345678', description: 'Phone number' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  phoneNo?: string;

  @ApiProperty({ example: 'Saud', description: 'Name of the person' })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ example: new Date(Date.now()), description: 'Start time of the appointment' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  appointmentStartTime: string;
  
  @ApiProperty({ example: '2024-12-13T13:00:00Z', description: 'End time of the appointment' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  appointmentEndTime: Date;

  @ApiProperty({ example: '6751b468c6cb3314e80694b0', description: 'District ID' })
  @IsNotEmpty()
  @IsMongoId()
  districtId: string;

  @ApiPropertyOptional({ description: 'Additional remarks' })
  @IsOptional()
  @IsString()
  remarks?: string;

  @ApiPropertyOptional({
    type: CreateDesignAppointmentDto,
    description: 'Design details (required for DESIGN type appointments)'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateDesignAppointmentDto)
  designDetails?: CreateDesignAppointmentDto;
}

