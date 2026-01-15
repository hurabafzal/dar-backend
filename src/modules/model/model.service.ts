import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelType, { ModelDocument } from './schemas/model.schema';
import { UpdateModelDto } from './dtos/update-model.dto';
import { CreateModelDto } from './dtos/create-model.dto';
import { Model } from 'mongoose';
import { MaterialService } from '../material/material/material.service';
import {
  configureS3Client,
  deleteModel,
  listCabinetFiles,
  uploadFiles,
  uploadModels,
} from 'src/shared/helper/helper';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(ModelType.name) private modelModel: Model<ModelDocument>,
    private readonly materialService: MaterialService,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<any> {
    const model = await this.modelModel
      .findOne({ uuid: createModelDto.uuid })
      .exec();

    if (model) {
      throw new NotFoundException(
        `Model with uuid ${createModelDto.uuid} already exists`,
      );
    }

    const createdModel = new this.modelModel(createModelDto);
    const savedModel = await createdModel.save();
    return await this.findOne(savedModel.uuid);
  }

  async uploadModel(files: any) {
    let filesData = [];

    if (files) {
      const fileDetails = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));

      const client = configureS3Client();

      filesData = await uploadModels(client, fileDetails);
    }

    return filesData;
  }

  async listModels() {
    return await listCabinetFiles(configureS3Client());
  }

  async deleteModel(fileName: string) {
    return await deleteModel(configureS3Client(), fileName);
  }

  async findAll(): Promise<ModelType[]> {
    const allModels = await this.modelModel.find().exec();
    const models = allModels.map(
      async (model) => await this.findOne(model.uuid),
    );

    return await Promise.all(models);
  }

  async findOne(id: string): Promise<any> {
    const model = await this.modelModel.findOne({ uuid: id }).exec();

    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }

    const framePrices = await this.materialService.getMaterialPrices(
      model.frame?.material,
    );
    const doorPrices = await this.materialService.getMaterialPrices(
      model.door?.material,
    );
    const drawerPrices = await this.materialService.getMaterialPrices(
      model.drawer?.material,
    );
    const shelfPrices = await this.materialService.getMaterialPrices(
      model.shelf?.material,
    );

    const framePrice = framePrices?.frame * model.frame?.count || 0;
    const doorPrice = doorPrices?.doors * model.door?.count || 0;
    const drawerPrice = drawerPrices?.drawers * model.drawer?.count || 0;
    const shelfPrice = shelfPrices?.shelves * model.shelf?.count || 0;

    const total = framePrice + doorPrice + drawerPrice + shelfPrice;

    const modelData = {
      _id: model._id,
      name: model.name,
      uuid: model.uuid,
      frame: {
        material: model.frame?.material || '',
        Price: framePrice || 0,
      },
      door: {
        material: model.door?.material || '',
        Price: doorPrice || 0,
      },
      drawer: {
        material: model.drawer?.material || '',
        Price: drawerPrice || 0,
      },
      shelf: {
        material: model.shelf?.material || '',
        Price: shelfPrice || 0,
      },
      price: total,
    };

    return modelData;
  }

  async update(updateModelDto: UpdateModelDto): Promise<any> {
    const { uuid, component, count, material } = updateModelDto;
    const model = await this.modelModel.findOne({ uuid }).exec();

    if (!model) {
      throw new NotFoundException(`Model with UUID ${uuid} not found`);
    }

    const oldMaterial = model[component.toLowerCase()].material;
    const oldCount = model[component.toLowerCase()].count;
    const oldPrice = await this.getMaterialPrice(oldMaterial, component);
    const newPrice = await this.getMaterialPrice(material, component);
    const subPrice = newPrice * updateModelDto.count - oldPrice * oldCount;
    model[component.toLowerCase()] = { count, material };
    await model.save();
    return {
      name: model.name,
      component,
      subPrice,
    };
  }

  async remove(id: string): Promise<any> {
    const model = await this.findOne(id);
    await this.modelModel.findOneAndDelete({ uuid: id }).exec();
    return { message: 'Model deleted successfully', model };
  }

  private async getMaterialPrice(
    material: string,
    component: string,
  ): Promise<number> {
    const prices = await this.materialService.getMaterialPrices(material);
    switch (component.toLowerCase()) {
      case 'frame':
        return prices?.frame || 0;
      case 'door':
        return prices?.doors || 0;
      case 'drawer':
        return prices?.drawers || 0;
      case 'shelf':
        return prices?.shelves || 0;
      default:
        return 0;
    }
  }
}
