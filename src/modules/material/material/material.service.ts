import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaterialDto } from './dtos/create-material.dto';
import { UpdateMaterialDto } from './dtos/update-material.dto';
import { Material, MaterialDocument } from './schemas/material.schema';
import { CalculatePriceDto } from './dtos/calculate-price.dto';
import { toObjectId } from 'src/shared/helper/helper';
import { PriceType } from './types/price.type';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<MaterialDocument>,
  ) {}

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const createdMaterial = new this.materialModel(createMaterialDto);
    return createdMaterial.save();
  }

  async findAll(): Promise<Material[]> {
    return this.materialModel.find().exec();
  }

  async findOne(id: string): Promise<Material> {
    const material = await (
      await this.materialModel.findById(toObjectId(id))
    );
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return material;
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const updatedMaterial = await this.materialModel
      .findByIdAndUpdate(toObjectId(id), updateMaterialDto, { new: true })
      .exec();
    if (!updatedMaterial) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    return updatedMaterial;
  }

  async remove(id: string): Promise<void> {
    const result = await this.materialModel
      .deleteOne({ _id: toObjectId(id) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
  }

  async getMaterialPrices(materialName: string): Promise<PriceType | null> {
    const materials = await this.findAll();
    const material = materials.find((m) => m.name === materialName);
    return material ? material.prices : null;
  }

  async findByCategory(category: string): Promise<Material[]> {
    return this.materialModel.find({ category }).exec();
  }

  async updatePrices(
    id: string,
    prices: Partial<Material['prices']>,
  ): Promise<Material> {
    const material = await this.materialModel.findById(toObjectId(id)).exec();
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    material.prices = { ...material.prices, ...prices };
    return material.save();
  }

  async toggleAvailability(id: string): Promise<Material> {
    const material = await this.materialModel.findById(toObjectId(id)).exec();
    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }
    material.isAvailable = !material.isAvailable;
    return material.save();
  }

  async calculatePrices(calculatePriceDto: CalculatePriceDto): Promise<any> {
    const result = {};
    let overalltotal = 0;

    for (const categoryDto of calculatePriceDto.categories) {
      const { category, components } = categoryDto;
      const materials = await this.materialModel.find({ category }).exec();

      if (materials.length > 0) {
        const categoryPrices = {};
        let total = 0;

        for (const [component, count] of Object.entries(components)) {
          if (count > 0) {
            const price = materials[0].prices[component.toLowerCase()] * count;
            categoryPrices[component] = price;
            total += price;
          }
        }

        result[category] = {
          prices: categoryPrices,
          total: total,
        };
        overalltotal += total;
      }
    }

    result['total'] = overalltotal;
    return result;
  }
}
