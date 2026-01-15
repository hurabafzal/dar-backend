import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateDesignModelDto } from './dtos/create-design-model.dto';
import { DesignModel } from './schemas/design-model';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { DesignModelService } from './design-model.service';

@ApiTags('design-models')
@Controller('design-models')
export class DesignModelController {
  constructor(private readonly designModelService: DesignModelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new measurment' })
  @ApiResponse({
    status: 201,
    description: 'The material has been successfully created.',
    type: DesignModel,
  })
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() createDesignModelDto: CreateDesignModelDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<DesignModel> {
    const thumbnailFile = files.find(
      (file) => file.fieldname === 'thumbnailSrc',
    );
    const modelFile = files.find((file) => file.fieldname === 'modelUrl');

    if (!thumbnailFile || !modelFile) {
      throw new Error('Both thumbnail and model files are required.');
    }

    createDesignModelDto.thumbnailSrc = thumbnailFile;
    createDesignModelDto.modelUrl = modelFile;

    return this.designModelService.create(createDesignModelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Design Models' })
  @ApiResponse({
    status: 200,
    description: 'Return all Design Models',
    type: [DesignModel],
  })
  findAll(): Promise<DesignModel[]> {
    return this.designModelService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Design Model by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the Design Model.',
    type: DesignModel,
  })
  @ApiResponse({ status: 404, description: 'Measurment not found.' })
  findOne(@Param('id') id: string): Promise<DesignModel> {
    return this.designModelService.findOne(id);
  }

  @Get('by-model-id/:id')
  @ApiOperation({ summary: 'Get a Design Model by model id' })
  @ApiResponse({
    status: 200,
    description: 'Return the Design Model.',
    type: DesignModel,
  })
  @ApiResponse({ status: 404, description: 'Measurment not found.' })
  findByModelId(@Param('id') id: string): Promise<DesignModel> {
    return this.designModelService.findByModelId(id);
  }

  @Get('by-model-category/:category')
  @ApiOperation({ summary: 'Get a Design Model by model category' })
  @ApiResponse({
    status: 200,
    description: 'Return the Design Model.',
    type: DesignModel,
  })
  @ApiResponse({ status: 404, description: 'Measurment not found.' })
  findByCategory(@Param('category') category: string): Promise<DesignModel[]> {
    return this.designModelService.findByCategory(category);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an design model by ID' })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the design model',
  })
  @ApiResponse({
    status: 204,
    description: 'design model successfully deleted',
  })
  @ApiResponse({ status: 404, description: 'design model not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.designModelService.remove(id);
  }
}
