import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateMeasurmentDto, LineItemDto } from './dtos/create-measurment.dto';
import { Measurment } from './schemas/measurment.schema';
import { MeasurmentService } from './measurment.service';
import { UpdateMeasurmentDto } from './dtos/update-measurment.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { EMeasurementType } from 'src/shared/enums/measurement-type.enum';
@ApiTags('measurements')
@Controller('measurements')
export class MeasurmentController {
  constructor(private readonly measurmentService: MeasurmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new measurment' })
  @ApiResponse({
    status: 201,
    description: 'The material has been successfully created.',
    type: Measurment,
  })
  @UseInterceptors(AnyFilesInterceptor())
  create(
    @Body() createMeasurmentDto: CreateMeasurmentDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<Measurment> {
    if (files) {
      createMeasurmentDto.files = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));
    }

    return this.measurmentService.create(createMeasurmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all measurements' })
  @ApiResponse({
    status: 200,
    description: 'Return all measurements.',
    type: [Measurment],
  })
  @ApiQuery({
    name: 'type',
    required: false,
  })
  @Get()
  async findAll(@Query('type') type?: EMeasurementType) {
    try {
      const result = await this.measurmentService.findAll(type);
      return result;
    } catch (error) {
      console.error('Service error:', error);
      return { error: error.message, stack: error.stack };
    }
  }
  //findAll(@Query('type') type?: EMeasurementType): Promise<Measurment[]> {
  //  return this.measurmentService.findAll(type);
  //}

  @Get(':id')
  @ApiOperation({ summary: 'Get a measurment by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the measurment.',
    type: Measurment,
  })
  @ApiResponse({ status: 404, description: 'Measurment not found.' })
  findOne(@Param('id') id: string): Promise<Measurment> {
    return this.measurmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a measurement' })
  @ApiResponse({
    status: 200,
    description: 'The measurement has been successfully updated.',
    type: Measurment,
  })
  @UseInterceptors(AnyFilesInterceptor())
  update(
    @Param('id') id: string,
    @Body() updateMeasurmentDto: UpdateMeasurmentDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Measurment> {
    if (files) {
      updateMeasurmentDto.files = files?.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));
    }

    return this.measurmentService.update(id, updateMeasurmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a measurment' })
  @ApiResponse({
    status: 200,
    description: 'The measurement has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.measurmentService.remove(id);
  }
}
