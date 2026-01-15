import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserGroupsDocument = UserGroups & Document;

@Schema({ timestamps: true })
export class UserGroups {
    @Prop({ unique: true, required: true })
    groupId: number;
  
    @Prop({ required: true, maxLength: 100 })
    groupNameEn: string;
  
    @Prop({ required: true, maxLength: 100 })
    groupNameAr: string;
}

export const UserGroupsSchema = SchemaFactory.createForClass(UserGroups);