import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { toObjectId } from 'src/shared/helper/helper';
import * as bcrypt from 'bcrypt';
import { IUserAnalytics } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userModel
        .findOne({
          $or: [
            { phone: createUserDto.phone },
            { email: createUserDto.email },
            { phone: createUserDto.phone },
          ],
        })
        .exec();

      if (existingUser) {
        if (existingUser.phone === createUserDto.phone) {
          throw new ConflictException(
            `User with phone: ${createUserDto.phone} already exists`,
          );
        }
        if (existingUser.email && existingUser.email === createUserDto.email) {
          throw new ConflictException(
            `User with email: ${createUserDto.email} already exists`,
          );
        }
        if (existingUser.phone === createUserDto.phone) {
          throw new ConflictException(
            `User with phone: ${createUserDto.phone} already exists`,
          );
        }
      }

      const createdUser = new this.userModel({
        ...createUserDto,
        password: createUserDto.password || undefined,
      });
      return createdUser.save();
    } catch (error) {
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const skip = (page - 1) * limit;
    return this.userModel
      .find()
      .select('-password -refreshToken')
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getUserAnalytics(): Promise<IUserAnalytics> {
    try {
      const now = new Date();

      const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      const startOfWeek = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - now.getDay(),
      );

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const countToday = await this.userModel.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
        },
        groupId: 3,
      });

      const countThisWeek = await this.userModel.countDocuments({
        createdAt: { $gte: startOfWeek },
        groupId: 3,
      });

      const countThisMonth = await this.userModel.countDocuments({
        createdAt: { $gte: startOfMonth },
        groupId: 3,
      });

      return { countToday, countThisWeek, countThisMonth };
    } catch (error) {
      console.error('Error fetching user counts:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException(`User with phone ${phone} not found`);
    }
    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(toObjectId(id)).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    const updatedUser = await this.userModel
      .findByIdAndUpdate(toObjectId(id), updateUserDto, { new: true })
      .exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string | null,
  ): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(
          toObjectId(userId),
          { refreshToken },
          { new: true, runValidators: true },
        )
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error updating refresh token:', error);
      throw new InternalServerErrorException('Failed to update refresh token');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
