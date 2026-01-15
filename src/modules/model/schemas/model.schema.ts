import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Types } from 'mongoose';

export type ModelDocument = Model & Document;

interface Component {
  count: number;
  material: string;
}

@Schema({ timestamps: true })
export default class Model {
  @Prop({ required: true })
  uuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  frame: Component;

  @Prop({ type: Object })
  door: Component;

  @Prop({ type: Object })
  drawer: Component;

  @Prop({ type: Object })
  shelf: Component;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
