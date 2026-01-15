import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Measurment, MeasurmentDocument } from './schemas/measurment.schema';
import { CreateMeasurmentDto, LineItemDto } from './dtos/create-measurment.dto';
import { ItemService } from 'src/modules/item/item.service';
import {
  configureS3Client,
  deleteFile,
  toObjectId,
  uploadFiles,
} from 'src/shared/helper/helper';
import { UpdateMeasurmentDto } from './dtos/update-measurment.dto';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { EMeasurementType } from 'src/shared/enums/measurement-type.enum';
import { ModelService } from 'src/modules/model/model.service';

@Injectable()
export class MeasurmentService {
  constructor(
    @InjectModel(Measurment.name)
    private measurmentModel: Model<MeasurmentDocument>,
    private readonly itemService: ItemService,
    private readonly modelService: ModelService,
  ) {}

  async create(createMeasurmentDto: CreateMeasurmentDto): Promise<Measurment> {
    let files = [];

    if (typeof createMeasurmentDto.lineItems === 'string') {
      createMeasurmentDto.lineItems = JSON.parse(createMeasurmentDto.lineItems);
    }

    const service =
      createMeasurmentDto.type === EMeasurementType.MEASUREMENT
        ? this.itemService
        : this.modelService;

    const lineItems = (createMeasurmentDto.lineItems as LineItemDto[]) || [];

    const reqLineItems = await Promise.all(
      lineItems.map(async (lineItem) => {
        const item = await service.findOne(lineItem?.id);
        item.description = lineItem.description;
        return item;
      }),
    );

    if (createMeasurmentDto.files) {
      const client = configureS3Client();

      files = await uploadFiles(client, createMeasurmentDto.files);
    }

    const createdMeasurment = new this.measurmentModel({
      ...createMeasurmentDto,
      lineItems: reqLineItems,
      files,
    });

    return createdMeasurment.save();
  }

  async findAll(type?: string): Promise<Measurment[]> {
    const query = type ? { type } : {};
    
    const measurements = (await this.measurmentModel
      .find(query)
      .lean()
      .exec()) as Measurment[];

    return measurements?.map((measurement: Measurment) => {
      return {
        ...measurement,
        files: measurement?.files?.map((file: any) => ({
          ...file,
          url:
            process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN && file?.fileId
              ? getSignedUrl({
                  keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
                  privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
                  url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${file?.fileId}`,
                  dateLessThan: new Date(
                    Date.now() + 1000 * 60 * 60 * 24
                  ).toISOString(),
                })
              : null,
        })),
      };
    });      
  }

  async findOne(id: string): Promise<Measurment> {
    const material = (await this.measurmentModel
      .findById(toObjectId(id))
      .lean()
      .exec()) as Measurment;
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return {
      ...material,
      files: material?.files?.map((file: any) => ({
        ...file,
        url: getSignedUrl({
          keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
          url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${file?.fileId}`,
          dateLessThan: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ).toISOString(),
        }),
      })),
    };
  }

  async update(
    id: string,
    updateMeasurmentDto: UpdateMeasurmentDto,
  ): Promise<Measurment> {
    const client = configureS3Client();
    const measurement = await this.findOne(id);
    if (measurement?.files && measurement?.files?.length > 0) {
      const existingFileIds = new Set(
        JSON.parse(updateMeasurmentDto.existingFiles)?.map(
          (file) => file.fileId,
        ),
      );
      const filesToDelete = measurement.files.filter(
        (file) => !existingFileIds.has(file.fileId),
      );
      await Promise.all(
        filesToDelete.map((file) => deleteFile(client, file.fileId)),
      );
      measurement.files = measurement.files.filter((file) =>
        existingFileIds.has(file.fileId),
      );
    }

    if (typeof updateMeasurmentDto.lineItems === 'string') {
      updateMeasurmentDto.lineItems = JSON.parse(updateMeasurmentDto.lineItems);
    }

    const service = measurement.type === EMeasurementType.MEASUREMENT
      ? this.itemService
      : this.modelService;

    const lineItems = Array.isArray(updateMeasurmentDto.lineItems)
      ? updateMeasurmentDto.lineItems
      : [];

    const reqLineItems = await Promise.all(
      lineItems.map(async (lineItem) => {
        const item = await service.findOne(lineItem?.id);
        item.description = lineItem.description;
        return item;
      })
    );

    let newFiles = [];
    if (updateMeasurmentDto.files) {
      newFiles = await uploadFiles(client, updateMeasurmentDto.files);
    }

    const updatedFiles = measurement?.files
      ? [...measurement.files, ...newFiles]
      : [...newFiles];

    const updatedMaterial = await this.measurmentModel
      .findByIdAndUpdate(
        toObjectId(id),
        {
          ...updateMeasurmentDto,
          lineItems: reqLineItems,
          files: updatedFiles,
        },
        { new: true },
      )
      .exec();
    if (!updatedMaterial) {
      throw new NotFoundException(`Measurment with ID ${id} not found`);
    }
    return updatedMaterial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.measurmentModel
      .deleteOne({ _id: toObjectId(id) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Measurment with ID ${id} not found`);
    }
  }
}
