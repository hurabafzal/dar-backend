import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MenuDocument = Menu & Document;

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true })
  menuId: number;

  @Prop()
  parentMenuId: number;

  @Prop({ required: true, maxlength: 50 })
  menuNameEn: string;

  @Prop({ required: true, maxlength: 50 })
  menuNameAr: string;

  @Prop({ maxlength: 150 })
  pageUrl: string;

  @Prop({ maxlength: 50 })
  icon: string;

  @Prop({ required: true })
  orderBy: number;

  @Prop({ default: true })
  show: boolean;
}

export const MenuSchema = SchemaFactory.createForClass(Menu);

