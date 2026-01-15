import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Item', required: false }) 
  itemId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, required: false, min: 1 }) 
  quantity: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ required: false })
  description: string;

  @Prop({ type: Boolean, default: false, required: false })
  isAdditional: boolean;

  @Prop({ required: false })
  item: string;

  @Prop({ required: false })
  amount: string; 

  @Prop({ required: false })
  status: string;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);