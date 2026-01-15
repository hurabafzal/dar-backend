import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesignModelDto } from './dtos/create-design-model.dto';
import { DesignModel, DesignModelDocument } from './schemas/design-model';
import { Model } from 'mongoose';
import {
  configureS3Client,
  deleteModelFile,
  toObjectId,
  uploadModelFile,
} from 'src/shared/helper/helper';
import { InjectModel } from '@nestjs/mongoose';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Injectable()
export class DesignModelService {
  constructor(
    @InjectModel(DesignModel.name)
    private designModelModel: Model<DesignModelDocument>,
  ) {}
  async create(
    createDesignModelDto: CreateDesignModelDto,
  ): Promise<DesignModel> {
    const client = configureS3Client();

    const modelUrl = await uploadModelFile(
      client,
      createDesignModelDto.modelUrl,
      'cabinets',
    );

    const thumbnailSrc = await uploadModelFile(
      client,
      createDesignModelDto.thumbnailSrc,
      'thumbnails',
    );

    const materialInfo = {
      Frame: 'Atlas',
      Door: 'Atlas',
      Drawer: 'Atlas',
      Shelf: 'Atlas',
    };

    const createdDesignModel = new this.designModelModel({
      ...createDesignModelDto,
      width: parseFloat(createDesignModelDto.width),
      height: parseInt(createDesignModelDto.height),
      depth: parseInt(createDesignModelDto.depth),
      modelUrl,
      thumbnailSrc,
      childObjInfo: JSON.parse(createDesignModelDto.childObjInfo),
      materialInfo,
    });

    return createdDesignModel.save();
  }

  async findAll(): Promise<DesignModel[]> {
    const models = (await this.designModelModel
      .find()
      .lean()
      .exec()) as DesignModel[];

    return models?.map((model: DesignModel) => ({
      ...model,
      thumbnailSrc: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/thumbnails/${model.thumbnailSrc}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
      modelUrl: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/cabinets/${model.modelUrl}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    }));
  }

  async findOne(id: string): Promise<DesignModel> {
    const model = (await this.designModelModel
      .findById(toObjectId(id))
      .lean()
      .exec()) as DesignModel;
    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }
    return {
      ...model,
      thumbnailSrc: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/thumbnails/${model?.thumbnailSrc}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
      modelUrl: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/cabinets/${model?.modelUrl}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    };
  }

  async findByModelId(id: string): Promise<DesignModel> {
    const model = (await this.designModelModel
      .findOne({ id })
      .lean()
      .exec()) as DesignModel;
    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }
    return {
      ...model,
      thumbnailSrc: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/thumbnails/${model?.thumbnailSrc}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
      modelUrl: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/cabinets/${model?.modelUrl}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    };
  }

  async findByCategory(category: string): Promise<DesignModel[]> {
    const models = (await this.designModelModel
      .find({ category })
      .lean()
      .exec()) as DesignModel[];
    if (!models) {
      throw new NotFoundException(`Model with category ${category} not found`);
    }
    return models?.map((model: DesignModel) => ({
      ...model,
      thumbnailSrc: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/thumbnails/${model.thumbnailSrc}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
      modelUrl: getSignedUrl({
        keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
        privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
        url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/cabinets/${model.modelUrl}`,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      }),
    }));
  }

  async remove(id: string): Promise<void> {
    const client = configureS3Client();
    const model = (await this.designModelModel
      .findById(toObjectId(id))
      .lean()
      .exec()) as DesignModel;

    await deleteModelFile(client, model.modelUrl, 'cabinets');
    await deleteModelFile(client, model.thumbnailSrc, 'thumbnails');

    const result = await this.designModelModel
      .deleteOne({ _id: toObjectId(id) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Design model with ID ${id} not found`);
    }
  }
}
