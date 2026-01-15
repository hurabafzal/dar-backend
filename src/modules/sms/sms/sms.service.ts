import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSmsDto } from './dtos/create-sms.dto';
import { UpdateSmsDto } from './dtos/update-sms.dto';
import { Sms, SmDocument } from './schemas/sms.schema';

@Injectable()
export class SmsService {
  constructor(@InjectModel(Sms.name) private smsModel: Model<SmDocument>) {}

  async create(createSmsDto: CreateSmsDto): Promise<Sms> {
    const createdSms = new this.smsModel(createSmsDto);
    return createdSms.save();
  }

  async findAll(page: number = 1, limit: number = 10): Promise<Sms[]> {
    const skip = (page - 1) * limit;
    return this.smsModel.find().skip(skip).limit(limit).exec();
  }

  async findOne(id: string): Promise<Sms> {
    const sms = await this.smsModel.findById(id).exec();
    if (!sms) {
      throw new NotFoundException(`SMS with ID ${id} not found`);
    }
    return sms;
  }

  async update(id: string, updateSmsDto: UpdateSmsDto): Promise<Sms> {
    const updatedSms = await this.smsModel
      .findByIdAndUpdate(id, updateSmsDto, { new: true })
      .exec();
    if (!updatedSms) {
      throw new NotFoundException(`SMS with ID ${id} not found`);
    }
    return updatedSms;
  }

  async remove(id: string): Promise<void> {
    const result = await this.smsModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`SMS with ID ${id} not found`);
    }
  }
}

