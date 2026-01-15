import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { FileSchema } from 'src/modules/measurment/measurment/schemas/measurment.schema';
import { EOrderStatus } from 'src/shared/enums/order-status.enum';
import { EPaymentTerms } from 'src/shared/enums/payment-terms.enum';
import { EUserType } from 'src/shared/enums/user-type.enum';

export type OrderDocument = Order & Document;

export interface OrderItem {
  itemId: string;
  item: string;
  description: string;
  quantity: string;
  price: string;
  amount: string;
  status: string;
  isAdditional: boolean;
}

export interface OrderInfo {
  orderId?: string;
  orderDate?: string;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
}

export interface DesignDetails {
  designId?: string;
  name?: string;
}

export interface SecurityInfo {
}

export interface ModelData {
  totalPrice?: string;
}

export interface DesignScreenshots {
  back?: string;
  front?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  customerId?: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Supplier',
    required: false,
  })
  supplierId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: EUserType,
    required: true,
  })
  userType: EUserType;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Measurment',
    required: false,
  })
  measurementId?: Types.ObjectId;

  @Prop({ required: true, default: () => new Date() })
  invoiceDate: Date;

  @Prop({
    type: String,
    enum: EOrderStatus,
    required: true,
    default: EOrderStatus.SAVED,
  })
  status: EOrderStatus;

  @Prop({
    type: String,
    enum: EPaymentTerms,
    required: false,
  })
  paymentTerms?: EPaymentTerms;

  @Prop({ required: false })
  referenceNo?: string;

  @Prop({ required: true })
  discount: number;

  @Prop({ required: false, type: [FileSchema] })
  files?: FileSchema[];

  @Prop({ 
    type: [{
      itemId: { type: String },
      item: { type: String },
      description: { type: String },
      quantity: { type: String },
      price: { type: String },
      amount: { type: String },
      status: { type: String },
      isAdditional: { type: Boolean, default: false }
    }], 
    required: false 
  })
  items?: OrderItem[];

  @Prop({ type: Date, required: false })
  estimatedDeliveryDate?: Date;

  @Prop({ required: true, default: 0 })
  grossAmount: number;

  @Prop({ required: true, default: 0 })
  totalAmount: number;

  @Prop({ required: false, default: 0 })
  paidAmount: number;

  @Prop({ unique: true, required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  invoiceType: string;

  @Prop({ required: true })
  orderType: string;

  @Prop({ required: false })
  comments?: string;

  @Prop({ required: false })
  measurementDescription?: string;

  @Prop({ 
    type: {
      orderId: { type: String },
      orderDate: { type: String }, 
      isAdditional: { type: Boolean, default: false }
    }, 
    required: false 
  })
  orderInfo?: Record<string, any>;

  @Prop({ 
    type: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    }, 
    required: false 
  })
  customerInfo?: Record<string, any>; 

  @Prop({ 
    type: {
      designId: { type: String },
      name: { type: String },
    }, 
    required: false 
  })
  designDetails?: Record<string, any>;

  @Prop({ type: Object, required: false })
  securityInfo?: Record<string, any>;

  @Prop({ type: [Object], required: false })
  fullModelData?: Record<string, any>[];

  @Prop({ 
    type: {
      back: { type: String },
      front: { type: String },
    }, 
    required: false 
  })
  designScreenshots?: Record<string, any>;

  @Prop({ required: false })
  chargeId?: string;

  @Prop({ 
    type: {
      url: { type: String },
      id: { type: String },
      status: { type: String }
    }, 
    required: false 
  })
  transaction?: Record<string, any>;

  @Prop({ type: Number, default: 0 })
  construction: number;

  @Prop({ type: Number, default: 0 })
  appointmentRequested: number;

  @Prop({ type: Number, default: 0 })
  appointmentCreated: number;

  @Prop({ type: String, required: false })
  appointmentDate?: string;

  @Prop({ type: String, required: false })
  appointmentStartTime?: string;

  @Prop({ type: String, required: false })
  appointmentEndTime?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.pre('save', function(next) {
  if (this.customerId === null) this.customerId = undefined;
  if (this.supplierId === null) this.supplierId = undefined;
  if (this.measurementId === null) this.measurementId = undefined;
  
  if (this.orderInfo && typeof this.orderInfo.orderDate === 'string') {
    try {
      if (this.orderInfo.orderDate.includes('/')) {
        const [day, month, year] = this.orderInfo.orderDate.split('/');
      }
    } catch (error) {
      console.error('Fehler beim Datums-Parsing:', error);
    }
  }
  
  next();
});