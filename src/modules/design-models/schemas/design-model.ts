import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DesignModelDocument = DesignModel & Document;

class ChildObjectInfo {
  @Prop()
  Frame: number;

  @Prop()
  Shelf: number;

  @Prop()
  Drawer: number;

  @Prop()
  Door: number;
}

class MaterialInfo {
  @Prop()
  Frame: string;

  @Prop()
  Shelf: string;

  @Prop()
  Drawer: string;

  @Prop()
  Door: string;
}

@Schema({ timestamps: true })
export class DesignModel {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: MongooseSchema.Types.ObjectId;

  @Prop({ unique: true })
  id: string;

  @Prop()
  category: string;

  @Prop()
  name: string;

  @Prop()
  thumbnailSrc: string;

  @Prop()
  modelUrl: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  depth: number;

  @Prop()
  childObjInfo: ChildObjectInfo;

  @Prop()
  materialInfo: MaterialInfo;
}

export const DesignModelSchema = SchemaFactory.createForClass(DesignModel);
