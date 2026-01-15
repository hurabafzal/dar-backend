import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Design, DesignDocument } from './schemas/design.schema';

@Injectable()
export class DesignService {
  constructor(
    @InjectModel(Design.name) private designModel: Model<DesignDocument>,
  ) { }

  async create(userId: string, orderData: any): Promise<Design> {
    const design = new this.designModel({
      userId,
      orderData,
    });
    return design.save();
  }

  async update(id: string, orderData: any): Promise<Design> {
    const updatedDesign = await this.designModel
      .findByIdAndUpdate(
        id,
        {
          orderData,
          updatedAt: new Date(),
        },
        { new: true }
      )
      .exec();

    if (!updatedDesign) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    return updatedDesign;
  }

  // ✅ DIESE METHODE HATTE GEFEHLT:
  async getLatestByUser(userId: string): Promise<Design | null> {
    return this.designModel
      .findOne({ userId })
      .sort({ updatedAt: -1 })
      .exec();
  }

  async deleteByUserId(userId: string): Promise<{ deleted: boolean; count: number }> {
    const result = await this.designModel
      .deleteMany({ userId })
      .exec();

    return {
      deleted: result.deletedCount > 0,
      count: result.deletedCount
    };
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const result = await this.designModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new NotFoundException(`Design with ID ${id} not found`);
    }

    return { deleted: true };
  }
}