import { Document } from 'mongoose';
import { UserRole } from '../enums/user-role.enum';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAnalytics {
  countToday: number;
  countThisWeek: number;
  countThisMonth: number;
}
