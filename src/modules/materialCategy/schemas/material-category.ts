import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MaterialCategoryDocument = MaterialCategory & Document;

@Schema()
class MaterialReferences {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ReferencedModel',
    required: true,
  })
  model: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  isVisible: boolean;
}

export class Texture {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  textureSrc: string;

  @Prop({ required: true, default: true })
  isVisible: boolean;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, type: [String] })
  features?: string[];

  @Prop({ required: false, type: Object })
  technicalSpecifications?: Record<string, string>;
  
  // Specific technical specifications fields from the image
  @Prop({ required: false })
  materialType?: string;
  
  @Prop({ required: false })
  surfaceFinish?: string;
  
  @Prop({ required: false })
  thickness?: string;
  
  @Prop({ required: false })
  resistance?: string;
  
  @Prop({ required: false })
  typicalApplication?: string;
}

@Schema({ timestamps: true })
export class MaterialCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: false, type: [Texture] })
  textures?: Texture[];

  @Prop({ reequired: false, type: [String], ref: 'Material' })
  supplierMaterial?: string[];

  // @Prop({ type: [MaterialReferences], default: [] })
  // materialReferences: MaterialReferences[];
}

export const MaterialCategorySchema =
  SchemaFactory.createForClass(MaterialCategory);
