import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BlockDatesService } from './block-dates.service';
import { CreateBlockDateDto } from './dtos/create-block-date.dto';
import { UpdateBlockDateDto } from './dtos/update-block-date.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('block-dates')
@Controller('block-dates')
export class BlockDatesController {
  constructor(private readonly blockDatesService: BlockDatesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new block date' })
  @ApiResponse({ status: 201, description: 'The block date has been successfully created.' })
  create(@Body() createBlockDateDto: CreateBlockDateDto) {
    return this.blockDatesService.create(createBlockDateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all block dates' })
  @ApiResponse({ status: 200, description: 'Return all block dates.' })
  findAll() {
    return this.blockDatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a block date by id' })
  @ApiResponse({ status: 200, description: 'Return the block date.' })
  findOne(@Param('id') id: string) {
    return this.blockDatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a block date' })
  @ApiResponse({ status: 200, description: 'The block date has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateBlockDateDto: UpdateBlockDateDto) {
    return this.blockDatesService.update(id, updateBlockDateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a block date' })
  @ApiResponse({ status: 200, description: 'The block date has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.blockDatesService.remove(id);
  }

  @Get('ranges/all')
  @ApiOperation({ summary: 'Get all block date ranges' })
  @ApiResponse({ status: 200, description: 'Return all block date ranges.' })
  findAllDateRanges() {
    return this.blockDatesService.findAllDateRanges();
  }

  @Delete('ranges/:id')
  @ApiOperation({ summary: 'Delete a block date range and associated block dates' })
  @ApiResponse({ status: 200, description: 'The block date range and associated block dates have been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Block date range not found.' })
  removeBlockDateRange(@Param('id') id: string) {
    return this.blockDatesService.removeBlockDateRange(id);
  }
}

