import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type BlockDateDocument = BlockDate & Document;

@Schema()
export class BlockDate {
  @Prop({ required: true })
  date: string;

  @Prop({ default: false })
  design: boolean;

  @Prop({ default: false })
  measurement: boolean;

  @Prop({ default: false })
  delivery: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'BlockDate' })
  blockDateRangeId: Types.ObjectId;
}

export const BlockDateSchema = SchemaFactory.createForClass(BlockDate);

