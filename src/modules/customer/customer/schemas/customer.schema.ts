import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ELanguage } from 'src/shared/enums/language.enum';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, maxLength: 50 })
  custNameE: string;

  @Prop({ required: true, maxLength: 50 })
  custNameA: string;

  @Prop({ maxLength: 20 })
  mobileNumber: string;

  @Prop({ maxLength: 20 })
  phone: string;

  @Prop({ maxLength: 100 })
  email: string;

  @Prop({ maxLength: 2000 })
  address: string;

  @Prop({ default: 1 })
  show: number;

  @Prop({ default: ELanguage.EN })
  preferredLanguage: ELanguage;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
