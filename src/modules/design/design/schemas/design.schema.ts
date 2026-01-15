import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DesignDocument = Design & Document;

@Schema({ timestamps: true })
export class Design {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  orderData: any;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DesignSchema = SchemaFactory.createForClass(Design);