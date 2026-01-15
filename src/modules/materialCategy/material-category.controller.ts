import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaterialCategory, Texture } from './schemas/material-category';
import { MaterialCategoryService } from './material-category.service';
import {
  CreateMaterialCategoryDto,
  CreateTextureDto,
} from './dtos/create-material-category.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateMaterialCategoryDto } from './dtos/update-material-category.dto';
import { ToggleVisibilityDto } from './dtos/toggle-visibility.dto';
import { SupplierMaterialDto } from './dtos/supplier-material.dto';
import { DeleteTextureDto } from './dtos/delete-texture.dto';
import { GetTextureDto } from './dtos/get-texture.dto';
import { UpdateTextureDto } from './dtos/update-texture.dto';
@ApiTags('material-category')
@Controller('material-category')
export class MaterialCategoryController {
  constructor(
    private readonly materialCategoryService: MaterialCategoryService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material category' })
  @ApiResponse({
    status: 201,
    description: 'The material category has been successfully created.',
    type: MaterialCategory,
  })
  create(@Body() createMaterialCategoryDto: CreateMaterialCategoryDto) {
    return this.materialCategoryService.create(createMaterialCategoryDto);
  }

  @Post('add-texture/:id')
  @ApiOperation({ summary: 'Add a new texture to category with description, features and specifications' })
  @ApiResponse({
    status: 201,
    description: 'The texture has been successfully added with all details.',
    type: MaterialCategory,
  })
  @UseInterceptors(AnyFilesInterceptor())
  addTexture(
    @Param('id') id: string,
    @Body() createTextureDto: CreateTextureDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<MaterialCategory> {
    const textureSrc = files.find((file) => file.fieldname === 'textureSrc');

    if (!textureSrc) {
      throw new Error('Texture file is required.');
    }
    
    // Parse features array and technical specifications if they come as strings
    if (createTextureDto.features && typeof createTextureDto.features === 'string') {
      try {
        createTextureDto.features = JSON.parse(createTextureDto.features as unknown as string);
      } catch (e) {
        createTextureDto.features = [];
      }
    }
    
    if (createTextureDto.technicalSpecifications && typeof createTextureDto.technicalSpecifications === 'string') {
      try {
        createTextureDto.technicalSpecifications = JSON.parse(
          createTextureDto.technicalSpecifications as unknown as string
        );
      } catch (e) {
        createTextureDto.technicalSpecifications = {};
      }
    }
    
    // Ensure specific technical fields are handled as strings
    createTextureDto.materialType = createTextureDto.materialType?.toString() || '';
    createTextureDto.surfaceFinish = createTextureDto.surfaceFinish?.toString() || '';
    createTextureDto.thickness = createTextureDto.thickness?.toString() || '';
    createTextureDto.resistance = createTextureDto.resistance?.toString() || '';
    createTextureDto.typicalApplication = createTextureDto.typicalApplication?.toString() || '';

    return this.materialCategoryService.addTexture(
      id,
      createTextureDto,
      textureSrc,
    );
  }

  @Patch('toggle-visibility')
  @ApiOperation({
    summary: 'Toggle visibility of a texture in a material category',
  })
  @ApiResponse({
    status: 200,
    description: 'The visibility of the texture has been successfully toggled.',
    type: MaterialCategory,
  })
  toggleVisibility(
    @Body() toggleVisibilityDto: ToggleVisibilityDto,
  ): Promise<MaterialCategory> {
    const { id, textureName } = toggleVisibilityDto;
    return this.materialCategoryService.toggleVisibility(id, textureName);
  }

  @Patch('add-supplier-material')
  @ApiOperation({ summary: 'Add a supplier material to a material category' })
  @ApiResponse({
    status: 200,
    description: 'Supplier material has been successfully added.',
    type: MaterialCategory,
  })
  addSupplierMaterial(
    @Body() supplierMaterialDto: SupplierMaterialDto,
  ): Promise<MaterialCategory> {
    const { id, materialId } = supplierMaterialDto;
    return this.materialCategoryService.addSupplierMaterial(id, materialId);
  }

  @Patch('remove-supplier-material')
  @ApiOperation({
    summary: 'Remove a supplier material from a material category',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier material has been successfully removed.',
    type: MaterialCategory,
  })
  removeSupplierMaterial(
    @Body() supplierMaterialDto: SupplierMaterialDto,
  ): Promise<MaterialCategory> {
    const { id, materialId } = supplierMaterialDto;
    return this.materialCategoryService.removeSupplierMaterial(id, materialId);
  }
  
  @Get('texture/:id/:textureId')
  @ApiOperation({
    summary: 'Get a single texture from a material category',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the texture details.',
  })
  getTexture(
    @Param('id') id: string,
    @Param('textureId') textureId: string,
  ) {
    return this.materialCategoryService.getTexture(id, textureId);
  }

  @Patch('update-texture')
  @ApiOperation({
    summary: 'Update a texture in a material category',
  })
  @ApiResponse({
    status: 200,
    description: 'The texture has been successfully updated.',
    type: MaterialCategory,
  })
  @UseInterceptors(AnyFilesInterceptor())
  updateTexture(@Body() updateTextureDto: UpdateTextureDto): Promise<MaterialCategory> {
    const { categoryId, textureId, ...rawUpdateData } = updateTextureDto;
    
    // Parse features array if it comes as string
    let features: string[] | undefined;
    if (rawUpdateData.features) {
      if (typeof rawUpdateData.features === 'string') {
        try {
          features = JSON.parse(rawUpdateData.features as string);
        } catch (e) {
          features = [];
        }
      } else {
        features = rawUpdateData.features;
      }
    }
    
    // Parse technical specifications if it comes as string
    let technicalSpecifications: Record<string, string> | undefined;
    if (rawUpdateData.technicalSpecifications) {
      if (typeof rawUpdateData.technicalSpecifications === 'string') {
        try {
          technicalSpecifications = JSON.parse(
            rawUpdateData.technicalSpecifications as string
          );
        } catch (e) {
          technicalSpecifications = {};
        }
      } else {
        technicalSpecifications = rawUpdateData.technicalSpecifications;
      }
    }

    // Build properly typed update object
    const updateData: Partial<Texture> = {};
    
    if (rawUpdateData.name) updateData.name = rawUpdateData.name;
    if (rawUpdateData.description !== undefined) updateData.description = rawUpdateData.description;
    if (features) updateData.features = features;
    if (technicalSpecifications) updateData.technicalSpecifications = technicalSpecifications;
    if (rawUpdateData.materialType !== undefined) updateData.materialType = rawUpdateData.materialType;
    if (rawUpdateData.surfaceFinish !== undefined) updateData.surfaceFinish = rawUpdateData.surfaceFinish;
    if (rawUpdateData.thickness !== undefined) updateData.thickness = rawUpdateData.thickness;
    if (rawUpdateData.resistance !== undefined) updateData.resistance = rawUpdateData.resistance;
    if (rawUpdateData.typicalApplication !== undefined) updateData.typicalApplication = rawUpdateData.typicalApplication;
    
    // Convert isVisible string to boolean if provided
    if (rawUpdateData.isVisible !== undefined) {
      updateData.isVisible = rawUpdateData.isVisible.toLowerCase() === 'true';
    }

    return this.materialCategoryService.updateTexture(categoryId, textureId, updateData);
  }

  @Delete('delete-texture')
  @ApiOperation({
    summary: 'Delete a texture from a material category',
  })
  @ApiResponse({
    status: 200,
    description: 'Texture has been successfully deleted.',
    type: MaterialCategory,
  })
  deleteTexture(
    @Body() deleteTextureDto: DeleteTextureDto,
  ): Promise<MaterialCategory> {
    const { id, textureId } = deleteTextureDto;
    return this.materialCategoryService.deleteTexture(id, textureId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all material categories' })
  @ApiResponse({
    status: 201,
    description: 'Return all material categories',
    type: [MaterialCategory],
  })
  findAll() {
    return this.materialCategoryService.findAll();
  }

  @Get('by-name/:name')
  @ApiOperation({ summary: 'Get all material category by name' })
  @ApiResponse({
    status: 201,
    description: 'Return all material category by name',
    type: MaterialCategory,
  })
  findOne(@Param('name') name: string) {
    return this.materialCategoryService.findOne(name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get all material category by id' })
  @ApiResponse({
    status: 201,
    description: 'Return all material category by id',
    type: MaterialCategory,
  })
  findById(@Param('id') id: string) {
    return this.materialCategoryService.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a material category' })
  @ApiResponse({
    status: 200,
    description: 'The material category has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.materialCategoryService.remove(id);
  }
}
