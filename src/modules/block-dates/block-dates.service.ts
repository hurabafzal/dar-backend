import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlockDate, BlockDateDocument } from './schemas/block-date.schema';
import { CreateBlockDateDto } from './dtos/create-block-date.dto';
import { UpdateBlockDateDto } from './dtos/update-block-date.dto';
import { formatDate, toObjectId } from 'src/shared/helper/helper';
import { BlockDateRange, BlockDateRangeDocument } from './schemas/block-date-range.schema';

@Injectable()
export class BlockDatesService {
  constructor(
    @InjectModel(BlockDate.name) private blockDateModel: Model<BlockDateDocument>,
    @InjectModel(BlockDateRange.name) private blockDateRangeModel: Model<BlockDateRangeDocument>
  ) {} 

  async create(createBlockDateDto: CreateBlockDateDto): Promise<BlockDate[]> {
    const startDate = createBlockDateDto.startDate;
    const endDate = createBlockDateDto.endDate;

    if (startDate > endDate) {
      throw new ConflictException('Start date must be before or equal to end date.');
    }

    const existingBlockDates = await this.blockDateModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();

    if (existingBlockDates.length > 0) {
      throw new ConflictException(
        'One or more block dates within the provided range already exist.',
      );
    }

    try {
      const blockDateRange = new this.blockDateRangeModel({
        startDate,
        endDate,
        design: createBlockDateDto.design,
        measurement: createBlockDateDto.measurement,
        delivery: createBlockDateDto.delivery,
      });
      const savedBlockDateRange = await blockDateRange.save();

      const blockDatesToInsert: Partial<BlockDate>[] = [];
      for (let date = new Date(startDate.split("T")[0]); date <= new Date(endDate.split("T")[0]); date.setDate(date.getDate() + 1)) {
        blockDatesToInsert.push({
          date: formatDate(date),
          design: createBlockDateDto.design,
          measurement: createBlockDateDto.measurement,
          delivery: createBlockDateDto.delivery,
          blockDateRangeId: toObjectId(savedBlockDateRange._id as string),
        });
      }

      const createdBlockDates = await this.blockDateModel.insertMany(blockDatesToInsert) as BlockDate[];
      return createdBlockDates;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<BlockDate[]> {
    return this.blockDateModel.find().exec();
  }

  async findOne(id: string): Promise<BlockDateRange> {
    return this.blockDateRangeModel.findById(toObjectId(id)).exec();
  }

  async update(
    id: string,
    updateBlockDateDto: UpdateBlockDateDto,
  ): Promise<BlockDate> {
    return this.blockDateModel
      .findByIdAndUpdate(toObjectId(id), updateBlockDateDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<BlockDate> {
    return this.blockDateModel.findByIdAndDelete(toObjectId(id)).exec();
  }

  async findAllDateRanges(): Promise<BlockDateRange[]> {
    return this.blockDateRangeModel.find().exec();
  }

  async removeBlockDateRange(id: string): Promise<{ message: string }> {
    const blockDateRange = await this.blockDateRangeModel.findById(toObjectId(id)).exec();
    if (!blockDateRange) {
      throw new NotFoundException(`Block date range with id ${id} not found`);
    }

    await this.blockDateModel.deleteMany({ blockDateRangeId: toObjectId(id) }).exec();

    await this.blockDateRangeModel.findByIdAndDelete(toObjectId(id)).exec();

    return { message: `Block date range with id ${id} and all associated block dates have been deleted` };
  }
}
