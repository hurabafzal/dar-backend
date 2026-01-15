import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GovernorateDocument = Governorate & Document;

@Schema()
export class Governorate {
  @Prop({ required: true })
  name: string;
}

export const GovernorateSchema = SchemaFactory.createForClass(Governorate);
