import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type DistrictDocument = District & Document;

@Schema()
export class District {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Governorate', required: true })
  governorateId: MongooseSchema.Types.ObjectId;
}

export const DistrictSchema = SchemaFactory.createForClass(District);

