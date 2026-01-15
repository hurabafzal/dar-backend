import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EQuotationStatus } from 'src/shared/enums/quotation-status.enum';

export type QuotationDocument = Quotation & Document;

@Schema({ timestamps: true })
export class Quotation {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop([{
    item: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, default: "1" },
    amount: { type: String },
  }])
  items: Array<{
    item: string;
    description: string;
    price: string;
    quantity?: string;
    amount?: string;
  }>;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: Number, default: 0 })
  grossAmount: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({
    type: String,
    enum: EQuotationStatus,
    default: EQuotationStatus.NEW,
  })
  status: EQuotationStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: false })
  orderId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String })
  comments?: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
