import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateMaterialCategoryDto,
  CreateTextureDto,
} from './dtos/create-material-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MaterialCategory, Texture } from './schemas/material-category';
import { Model, Types } from 'mongoose';
import {
  configureS3Client,
  toObjectId,
  uploadModelFile,
} from 'src/shared/helper/helper';
import { Material } from '../material/material/schemas/material.schema';
import { UpdateMaterialCategoryDto } from './dtos/update-material-category.dto';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Injectable()
export class MaterialCategoryService {
  constructor(
    @InjectModel(MaterialCategory.name)
    private materialCategoryModel: Model<MaterialCategory>,
    // @InjectModel(Material.name)
    // private materialModel: Model<Material>,
  ) {}
  async create(
    createMaterialCategoryDto: CreateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory = new this.materialCategoryModel(
        createMaterialCategoryDto,
      );

      return await materialCategory.save();
    } catch (error) {
      throw new Error('Failed to create material category');
    }
  }

  async addTexture(
    id: string,
    createTextureDto: CreateTextureDto,
    textureSrc: Express.Multer.File,
  ): Promise<MaterialCategory> {
    try {
      const category = await this.materialCategoryModel.findById(id);

      const client = configureS3Client();
      const textureUrl = await uploadModelFile(
        client,
        textureSrc,
        `${category?.name}/textures`,
      );

      createTextureDto.textureSrc = textureUrl;
      createTextureDto.name = createTextureDto.name
        ? createTextureDto.name
        : textureSrc.originalname;
      const isVisible = createTextureDto.isVisible.toLowerCase() === 'true';
      
      // Create the texture object with all the new fields
      const textureData = {
        _id: toObjectId(new Types.ObjectId().toString()), // Generate unique ID for new texture
        ...createTextureDto,
        isVisible,
        description: createTextureDto.description || '',
        features: createTextureDto.features || [],
        technicalSpecifications: createTextureDto.technicalSpecifications || {},
        materialType: createTextureDto.materialType || '',
        surfaceFinish: createTextureDto.surfaceFinish || '',
        thickness: createTextureDto.thickness || '',
        resistance: createTextureDto.resistance || '',
        typicalApplication: createTextureDto.typicalApplication || ''
      };

      const materialCategory = this.materialCategoryModel.findByIdAndUpdate(
        id,
        { $push: { textures: textureData } },
        { new: true },
      );

      return await materialCategory;
    } catch (error) {
      throw new Error('Failed to add texture to material category');
    }
  }

  async toggleVisibility(
    id: string,
    textureName: string,
  ): Promise<MaterialCategory> {
    try {
      const category = await this.materialCategoryModel.findById(id);

      const materialCategory = this.materialCategoryModel.findByIdAndUpdate(
        id,
        {
          $set: {
            'textures.$[texture].isVisible': !category?.textures?.find(
              (texture: Texture) => texture.name === textureName,
            )?.isVisible,
          },
        },
        {
          arrayFilters: [{ 'texture.name': textureName }],
          new: true,
        },
      );
      return materialCategory;
    } catch (error) {
      throw new Error('Failed to create material category');
    }
  }

  async addSupplierMaterial(
    id: string,
    materialId: string,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory =
        await this.materialCategoryModel.findByIdAndUpdate(
          id,
          { $addToSet: { supplierMaterial: materialId } },
          { new: true },
        );
      if (!materialCategory) {
        throw new NotFoundException(
          `Material Category with ID ${id} not found`,
        );
      }
      return materialCategory;
    } catch (error) {
      throw new Error('Failed to add supplier material');
    }
  }

  async removeSupplierMaterial(
    id: string,
    materialId: string,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory =
        await this.materialCategoryModel.findByIdAndUpdate(
          id,
          { $pull: { supplierMaterial: materialId } },
          { new: true },
        );
      if (!materialCategory) {
        throw new NotFoundException(
          `Material Category with ID ${id} not found`,
        );
      }
      return materialCategory;
    } catch (error) {
      throw new Error('Failed to remove supplier material');
    }
  }

  async addMaterialToCategory(
    createMaterialCategoryDto: CreateMaterialCategoryDto,
  ): Promise<MaterialCategory> {
    try {
      const materialCategory = new this.materialCategoryModel(
        createMaterialCategoryDto,
      );

      return await materialCategory.save();
    } catch (error) {
      throw new Error('Failed to create material category');
    }
  }

  async findAll(): Promise<MaterialCategory[]> {
    try {
      const category = (await this.materialCategoryModel
        .find()
        .populate('supplierMaterial')
        .lean()
        .exec()) as MaterialCategory[];

      return category?.map((category: MaterialCategory) => ({
        ...category,
        textures: category?.textures?.map((texture: Texture) => ({
          ...texture,
          textureSrc: getSignedUrl({
            keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
            url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${category?.name}/textures/${texture.textureSrc}`,
            dateLessThan: new Date(
              Date.now() + 1000 * 60 * 60 * 24,
            ).toISOString(),
          }),
        })),
      }));
    } catch (error) {
      throw new Error('Failed to retrieve material categories');
    }
  }

  async findOne(name: string): Promise<MaterialCategory> {
    try {
      const category = (await this.materialCategoryModel
        .findOne({ name })
        .populate('supplierMaterial')
        .lean()
        .exec()) as MaterialCategory;

      const texturesWithSignedUrls = category?.textures?.map(
        (texture: Texture) => ({
          ...texture,
          textureSrc: getSignedUrl({
            keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
            url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${category?.name}/textures/${texture.textureSrc}`,
            dateLessThan: new Date(
              Date.now() + 1000 * 60 * 60 * 24,
            ).toISOString(),
          }),
        }),
      );

      return {
        ...category,
        textures: texturesWithSignedUrls,
      } as MaterialCategory;
    } catch (error) {
      throw new Error('Failed to retrieve material category');
    }
  }

  async findById(id: string): Promise<MaterialCategory> {
    try {
      const category = (await this.materialCategoryModel
        .findOne({ _id: toObjectId(id) })
        .populate('supplierMaterial')
        .lean()
        .exec()) as MaterialCategory;

      const texturesWithSignedUrls = category?.textures?.map(
        (texture: Texture) => ({
          ...texture,
          textureSrc: getSignedUrl({
            keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
            privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
            url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${category?.name}/textures/${texture.textureSrc}`,
            dateLessThan: new Date(
              Date.now() + 1000 * 60 * 60 * 24,
            ).toISOString(),
          }),
        }),
      );

      return {
        ...category,
        textures: texturesWithSignedUrls,
      } as MaterialCategory;
    } catch (error) {
      throw new Error('Failed to retrieve material category');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.materialCategoryModel
      .deleteOne({ _id: toObjectId(id) })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Material Category with ID ${id} not found`);
    }
  }
  
  async deleteTexture(id: string, textureId: string): Promise<MaterialCategory> {
    try {
      const materialCategory = await this.materialCategoryModel.findByIdAndUpdate(
        id,
        { $pull: { textures: { _id: toObjectId(textureId) } } },
        { new: true },
      );
      
      if (!materialCategory) {
        throw new NotFoundException(`Material Category with ID ${id} not found`);
      }
      
      return materialCategory;
    } catch (error) {
      throw new Error(`Failed to delete texture: ${error.message}`);
    }
  }

  async getTexture(id: string, textureId: string): Promise<Texture> {
    try {
      const category = (await this.materialCategoryModel
        .findOne({ _id: toObjectId(id) })
        .lean()
        .exec()) as MaterialCategory;

      if (!category) {
        throw new NotFoundException(`Material Category with ID ${id} not found`);
      }

      const texture = category.textures?.find(
        (texture: any) => texture._id.toString() === textureId,
      );

      if (!texture) {
        throw new NotFoundException(
          `Texture with ID ${textureId} not found in category ${id}`,
        );
      }

      // Return texture with signed URL
      return {
        ...texture,
        textureSrc: getSignedUrl({
          keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
          url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${category?.name}/textures/${texture.textureSrc}`,
          dateLessThan: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ).toISOString(),
        }),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to retrieve texture: ${error.message}`);
    }
  }

  async updateTexture(
    id: string,
    textureId: string,
    updateData: Partial<Texture>,
  ): Promise<MaterialCategory> {
    try {
      const category = await this.materialCategoryModel.findById(id);

      if (!category) {
        throw new NotFoundException(`Material Category with ID ${id} not found`);
      }

      const textureIndex = category.textures?.findIndex(
        (texture: any) => texture._id.toString() === textureId,
      );

      if (textureIndex === -1 || textureIndex === undefined) {
        throw new NotFoundException(
          `Texture with ID ${textureId} not found in category ${id}`,
        );
      }

      // Build the update object dynamically
      const updateFields: any = {};
      
      if (updateData.name !== undefined) {
        updateFields['textures.$.name'] = updateData.name;
      }
      if (updateData.isVisible !== undefined) {
        updateFields['textures.$.isVisible'] = updateData.isVisible;
      }
      if (updateData.description !== undefined) {
        updateFields['textures.$.description'] = updateData.description;
      }
      if (updateData.features !== undefined) {
        updateFields['textures.$.features'] = updateData.features;
      }
      if (updateData.technicalSpecifications !== undefined) {
        updateFields['textures.$.technicalSpecifications'] = updateData.technicalSpecifications;
      }
      if (updateData.materialType !== undefined) {
        updateFields['textures.$.materialType'] = updateData.materialType;
      }
      if (updateData.surfaceFinish !== undefined) {
        updateFields['textures.$.surfaceFinish'] = updateData.surfaceFinish;
      }
      if (updateData.thickness !== undefined) {
        updateFields['textures.$.thickness'] = updateData.thickness;
      }
      if (updateData.resistance !== undefined) {
        updateFields['textures.$.resistance'] = updateData.resistance;
      }
      if (updateData.typicalApplication !== undefined) {
        updateFields['textures.$.typicalApplication'] = updateData.typicalApplication;
      }

      const materialCategory = await this.materialCategoryModel.findOneAndUpdate(
        { _id: toObjectId(id), 'textures._id': toObjectId(textureId) },
        { $set: updateFields },
        { new: true },
      );

      if (!materialCategory) {
        throw new NotFoundException(
          `Failed to update texture ${textureId} in category ${id}`,
        );
      }

      return materialCategory;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update texture: ${error.message}`);
    }
  }
}
