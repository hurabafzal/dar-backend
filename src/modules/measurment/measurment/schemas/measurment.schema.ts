import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EMeasurementType } from 'src/shared/enums/measurement-type.enum';

export type MeasurmentDocument = Measurment & Document;

class LineItem {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;
}

export class FileSchema {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileId: string;
}

@Schema({ timestamps: true })
export class Measurment {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  measurment: string;

  @Prop({ required: true })
  measurementDate: Date;

  @Prop({ required: false })
  comments?: string;

  @Prop({
    type: String,
    enum: EMeasurementType,
    required: true,
    default: EMeasurementType.MEASUREMENT,
  })
  type: EMeasurementType;

  @Prop({ required: false })
  files?: FileSchema[];

  @Prop({ required: false })
  lineItems?: LineItem[];

  @Prop({
    type: String,
    ref: 'User',
    required: true,
  })
  customerId: String;

  @Prop({ required: false })
  chargeId?: string;
}

export const MeasurmentSchema = SchemaFactory.createForClass(Measurment);
