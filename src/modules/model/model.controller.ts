import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import Model from './schemas/model.schema';
import { UpdateModelDto } from './dtos/update-model.dto';
import { CreateModelDto } from './dtos/create-model.dto';
import { ModelService } from './model.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { deleteModel } from 'mongoose';

@ApiTags('models')
@Controller('models')
export class ModelController {
  constructor(private readonly ModelService: ModelService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Model' })
  @ApiResponse({
    status: 201,
    description: 'The Model has been successfully created.',
    type: Model,
  })
  create(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.ModelService.create(createModelDto);
  }

  @Post('upload-models')
  @ApiOperation({ summary: 'Upload a new Model' })
  @ApiResponse({
    status: 201,
    description: 'Model uploaded successfully',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadModel(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<any> {
    return this.ModelService.uploadModel(files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Models' })
  @ApiResponse({
    status: 200,
    description: 'Return all Models.',
    type: [Model],
  })
  findAll(): Promise<Model[]> {
    return this.ModelService.findAll();
  }

  @Get('list-models')
  @ApiOperation({ summary: 'Get all Models' })
  @ApiResponse({
    status: 200,
    description: 'Return all Models.',
  })
  listModels(): Promise<any> {
    return this.ModelService.listModels();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Get a Model by id' })
  @ApiResponse({ status: 200, description: 'Return the Model.', type: Model })
  @ApiResponse({ status: 404, description: 'Model not found.' })
  findOne(@Param('uuid') id: string): Promise<Model> {
    return this.ModelService.findOne(id);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update a Model' })
  @ApiResponse({
    status: 200,
    description: 'The Model has been successfully updated.',
    type: Model,
  })
  update(@Body() updateModelDto: UpdateModelDto): Promise<Model> {
    return this.ModelService.update(updateModelDto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a Model' })
  @ApiResponse({
    status: 200,
    description: 'The Model has been successfully deleted.',
  })
  remove(@Param('uuid') id: string): Promise<Model> {
    return this.ModelService.remove(id);
  }

  @Delete('delete-model/:name')
  @ApiOperation({ summary: 'Delete a Model' })
  @ApiResponse({
    status: 200,
    description: 'The Model has been successfully deleted.',
  })
  deleteModel(@Param('name') name: string): Promise<any> {
    return this.ModelService.deleteModel(name);
  }
}
