import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MaterialDocument = Material & Document;

@Schema({ timestamps: true })
export class Material {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, enum: ['A', 'B', 'C', 'OTHER'] })
  category: string;

  @Prop({ type: Object, required: true })
  prices: {
    frame: number;
    shelves: number;
    drawers: number;
    doors: number;
  };

  @Prop({ type: String, required: true })
  priceUnit: string;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  imageUrl?: string;

  // @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MaterialCategory' })
  // categoryId?: MongooseSchema.Types.ObjectId;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
