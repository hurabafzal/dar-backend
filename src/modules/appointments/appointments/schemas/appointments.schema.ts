import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { AppointmentType } from 'src/shared/enums/appointments.enum';
import { DesignDetails } from '../interfaces/design.interface';
import { BadRequestException } from '@nestjs/common';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'User' })
  customerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  type: AppointmentType;

  @Prop({ required: false })
  phoneNo: string;

  @Prop({ required: false })
  name: string;

  @Prop({ required: true })
  appointmentStartTime: string;

  @Prop({ required: false })
  appointmentEndTime: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'Governorate',
  })
  governorateId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: true,
    ref: 'District',
  })
  districtId: MongooseSchema.Types.ObjectId;

  @Prop()
  remarks: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: false, ref: 'Order' })
  orderId?: Types.ObjectId;

  @Prop({ type: Object, required: false })
  designDetails?: DesignDetails;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

AppointmentSchema.pre('save', function (next) {
  if (this.type === AppointmentType.DESIGN && !this.designDetails) {
    throw new BadRequestException(
      'Design details are required when type is DESIGN.',
    );
  }
  if (this.type !== AppointmentType.DESIGN && this.designDetails) {
    throw new BadRequestException(
      'Design details are not allowed when type is not DESIGN.',
    );
  }
  next();
});
