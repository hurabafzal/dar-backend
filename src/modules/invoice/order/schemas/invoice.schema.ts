import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EInvoiceStatus } from 'src/shared/enums/invoice-status.enum';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: Number, default: 0 })
  paidAmount: number;

  @Prop({
    type: String,
    enum: EInvoiceStatus,
    default: EInvoiceStatus.MEASUREMENT,
  })
  status: EInvoiceStatus;

  @Prop({ type: String })
  chargeId?: string;

  @Prop()
  tapPaymentLink?: string;

  @Prop()
  chargeType?: string;
  
  @Prop({ type: Number, default: 0 })
  construction: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
