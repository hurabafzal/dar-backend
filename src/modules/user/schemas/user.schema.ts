import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ELanguage } from 'src/shared/enums/language.enum';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;
const DEFAULT_PASSWORD = 'password123';
@Schema({ timestamps: true })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id?: Types.ObjectId;

  @Prop({ required: false, unique: true })
  userId?: string;

  @Prop()
  groupId?: number;

  @Prop()
  password: string;

  @Prop()
  userName?: string;

  @Prop()
  userNameAr?: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  preferredLanguage?: ELanguage;

  @Prop({ default: false })
  disabled?: boolean;

  @Prop({ required: false })
  email?: string;

  @Prop()
  defaultPage?: string;

  @Prop()
  refreshToken?: string;

  @Prop()
  address?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.password) {
    this.password = DEFAULT_PASSWORD;
  }

  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});
