import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class DesignersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find({ groupId: 2 }).select("-password").exec();
  }

  async findOne(id: string): Promise<User> {
    const designer = await this.userModel.findOne({ _id: id, groupId: 2 }).exec();
    if (!designer) {
      throw new NotFoundException(`Designer with ID ${id} not found`);
    }
    return designer;
  }

  async update(id: string, updateDesignerDto: Partial<User>): Promise<User> {
    const updatedDesigner = await this.userModel
      .findOneAndUpdate({ _id: id, groupId: 2 }, updateDesignerDto, { new: true })
      .exec();
    if (!updatedDesigner) {
      throw new NotFoundException(`Designer with ID ${id} not found`);
    }
    return updatedDesigner;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findOneAndDelete({ _id: id, groupId: 2 }).exec();
    if (!result) {
      throw new NotFoundException(`Designer with ID ${id} not found`);
    }
  }
}

