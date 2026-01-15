import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dtos/create-material.dto';
import { UpdateMaterialDto } from './dtos/update-material.dto';
import { CalculatePriceDto } from './dtos/calculate-price.dto';
import { Material } from './schemas/material.schema';

@ApiTags('materials')
@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new material' })
  @ApiResponse({ status: 201, description: 'The material has been successfully created.', type: Material })
  create(@Body() createMaterialDto: CreateMaterialDto): Promise<Material> {
    return this.materialService.create(createMaterialDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all materials' })
  @ApiResponse({ status: 200, description: 'Return all materials.', type: [Material] })
  findAll(): Promise<Material[]> {
    return this.materialService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material by id' })
  @ApiResponse({ status: 200, description: 'Return the material.', type: Material })
  @ApiResponse({ status: 404, description: 'Material not found.' })
  findOne(@Param('id') id: string): Promise<Material> {
    return this.materialService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a material' })
  @ApiResponse({ status: 200, description: 'The material has been successfully updated.', type: Material })
  update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto): Promise<Material> {
    return this.materialService.update(id, updateMaterialDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a material' })
  @ApiResponse({ status: 200, description: 'The material has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.materialService.remove(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get materials by category' })
  @ApiResponse({ status: 200, description: 'Return materials of the specified category.', type: [Material] })
  findByCategory(@Param('category') category: string): Promise<Material[]> {
    return this.materialService.findByCategory(category);
  }

  @Patch(':id/prices')
  @ApiOperation({ summary: 'Update prices for a material' })
  @ApiResponse({ status: 200, description: 'The material prices have been successfully updated.', type: Material })
  updatePrices(@Param('id') id: string, @Body() prices: Partial<Material['prices']>): Promise<Material> {
    return this.materialService.updatePrices(id, prices);
  }

  @Patch(':id/toggle-availability')
  @ApiOperation({ summary: 'Toggle availability of a material' })
  @ApiResponse({ status: 200, description: 'The material availability has been successfully toggled.', type: Material })
  toggleAvailability(@Param('id') id: string): Promise<Material> {
    return this.materialService.toggleAvailability(id);
  }

  @Post('calculate-price')
  @ApiOperation({ summary: 'Calculate prices for materials' })
  @ApiResponse({ status: 200, description: 'Returns calculated prices for materials.' })
  async calculatePrices(@Body() calculatePriceDto: CalculatePriceDto) {
    return this.materialService.calculatePrices(calculatePriceDto);
  }
}

