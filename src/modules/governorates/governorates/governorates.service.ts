import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Governorate, GovernorateDocument } from './schemas/governorates.schema';
import { CreateGovernorateDto } from './dtos/create-governorate.dto';
import { UpdateGovernorateDto } from './dtos/update-governorate.dto';
import { toObjectId } from 'src/shared/helper/helper';

@Injectable()
export class GovernorateService {
  constructor(
    @InjectModel(Governorate.name) private governorateModel: Model<GovernorateDocument>,
  ) {}

  async create(createGovernorateDto: CreateGovernorateDto): Promise<Governorate> {
    const createdGovernorate = new this.governorateModel(createGovernorateDto);
    return createdGovernorate.save();
  }

  async findAll(): Promise<Governorate[]> {
    return this.governorateModel.find().exec();
  }

  async findOne(id: string): Promise<Governorate> {
    return this.governorateModel.findById(toObjectId(id)).exec();
  }

  async update(id: string, updateGovernorateDto: UpdateGovernorateDto): Promise<Governorate> {
    return this.governorateModel.findByIdAndUpdate(toObjectId(id), updateGovernorateDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Governorate> {
    return this.governorateModel.findByIdAndDelete(toObjectId(id)).exec();
  }
}

