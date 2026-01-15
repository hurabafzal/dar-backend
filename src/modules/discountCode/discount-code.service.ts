import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DiscountCode,
  DiscountCodeDocument,
} from './schemas/discount-code.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { toObjectId } from 'src/shared/helper/helper';
import { CreateDiscountCodeDto } from './dtos/create-discount-code.dto';
import { UpdateDiscountCodeDto } from './dtos/update-discount-code.dto';

@Injectable()
export class DiscountCodeService {
  constructor(
    @InjectModel(DiscountCode.name)
    private DiscountCodeModel: Model<DiscountCodeDocument>,
  ) {}

  async create(
    createDiscountCodeDto: CreateDiscountCodeDto,
  ): Promise<DiscountCode> {
    const createdDiscountCode = new this.DiscountCodeModel(
      createDiscountCodeDto,
    );
    return createdDiscountCode.save();
  }

  async findAll(): Promise<DiscountCode[]> {
    return this.DiscountCodeModel.find().exec();
  }

  async getValidDiscountCodes(): Promise<DiscountCode[]> {
    const now = new Date().toISOString();
    return this.DiscountCodeModel.find({ expiryDate: { $gte: now } }).exec();
  }

  async findOne(id: string): Promise<DiscountCode> {
    const DiscountCode = await this.DiscountCodeModel.findById(
      toObjectId(id),
    ).exec();
    if (!DiscountCode) {
      throw new NotFoundException(`Discount Code with ID ${id} not found`);
    }
    return DiscountCode;
  }

  async findByName(name: string): Promise<DiscountCode> {
    const DiscountCode = await this.DiscountCodeModel.findOne({ name }).exec();
    if (!DiscountCode) {
      throw new NotFoundException(`Discount Code with ID ${name} not found`);
    }
    return DiscountCode;
  }

  async update(
    id: string,
    updateDiscountCodeDto: UpdateDiscountCodeDto,
  ): Promise<DiscountCode> {
    const updatedDiscountCode = await this.DiscountCodeModel.findByIdAndUpdate(
      toObjectId(id),
      updateDiscountCodeDto,
      { new: true },
    ).exec();
    if (!updatedDiscountCode) {
      throw new NotFoundException(`Discount Code with ID ${id} not found`);
    }
    return updatedDiscountCode;
  }

  async remove(id: string): Promise<void> {
    const result = await this.DiscountCodeModel.deleteOne({
      _id: toObjectId(id),
    }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Discount Code with ID ${id} not found`);
    }
  }
}
