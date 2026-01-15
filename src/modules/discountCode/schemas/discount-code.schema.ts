import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DiscountCodeDocument = DiscountCode & Document;

@Schema({ timestamps: true })
export class DiscountCode {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ required: false })
  description: string;
}

export const DiscountCodeSchema = SchemaFactory.createForClass(DiscountCode);
