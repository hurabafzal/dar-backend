import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SmDocument = Sms & Document;

@Schema({ timestamps: true })
export class Sms {
  @Prop({ required: true, unique: true })
  smsId: string;

  @Prop({ required: true, maxlength: 100 })
  smsCode: string;

  @Prop({ required: true, maxLength: 1000 })
  smsContentE: string;

  @Prop({ required: true, maxlength: 1000 })
  smsContentA: string;
}

export const SmsSchema = SchemaFactory.createForClass(Sms);

