import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlockDateRangeDocument = BlockDateRange & Document;

@Schema()
export class BlockDateRange {
  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  endDate: string;

  @Prop({ default: false })
  design: boolean;

  @Prop({ default: false })
  measurement: boolean;

  @Prop({ default: false })
  delivery: boolean;
}

export const BlockDateRangeSchema = SchemaFactory.createForClass(BlockDateRange);
