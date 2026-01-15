import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment, AppointmentSchema } from './schemas/appointments.schema';
import { District, DistrictSchema } from 'src/modules/district/schemas/district.schema';
import { BlockDate, BlockDateSchema } from 'src/modules/block-dates/schemas/block-date.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }]),
    MongooseModule.forFeature([{ name: BlockDate.name, schema: BlockDateSchema }])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}

