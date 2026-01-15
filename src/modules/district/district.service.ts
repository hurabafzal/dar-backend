import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { District, DistrictDocument } from './schemas/district.schema';
import { CreateDistrictDto } from './dtos/create-district.dto';
import { UpdateDistrictDto } from './dtos/update-district.dto';
import { toObjectId } from 'src/shared/helper/helper';

@Injectable()
export class DistrictService {
  constructor(
    @InjectModel(District.name) private districtModel: Model<DistrictDocument>,
  ) {}

  async create(createDistrictDto: CreateDistrictDto): Promise<District> {
    const createdDistrict = new this.districtModel(createDistrictDto);
    return createdDistrict.save();
  }

  async findAll(): Promise<District[]> {
    return this.districtModel.find().populate('governorateId').exec();
  }

  async findOne(id: string): Promise<District> {
    return this.districtModel.findById(toObjectId(id)).populate('governorateId').exec();
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto): Promise<District> {
    return this.districtModel.findByIdAndUpdate(toObjectId(id), updateDistrictDto, { new: true }).populate('governorateId').exec();
  }

  async remove(id: string): Promise<District> {
    return this.districtModel.findByIdAndDelete(toObjectId(id)).exec();
  }

  async findByGovernorate(governorateId: string): Promise<District[]> {
    return this.districtModel.find({ governorateId: toObjectId(governorateId) }).populate('governorateId').exec();
  }
}

