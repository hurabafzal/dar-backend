import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { UpdateAppointmentDto } from './dtos/update-appointment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppointmentType } from 'src/shared/enums/appointments.enum';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({
    status: 201,
    description: 'The appointment has been successfully created.',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments' })
  @ApiResponse({ status: 200, description: 'Return all appointments.' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific appointment' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Get("type/:type")
  @ApiOperation({ summary: 'Get a specific appointment' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findByType(@Param('type') type: AppointmentType) {
    return this.appointmentsService.findByType(type);
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Get all appointments of a customer' })
  @ApiResponse({ status: 200, description: 'Return all appointments of a customer.' })
  findCustomerAppointments(@Param('id') id: string) {
    return this.appointmentsService.findCustomerAppointments(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment' })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({
    status: 200,
    description: 'The appointment has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
