import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemService } from './item.service';
import { Item } from './schemas/material.schema';
import { CreateItemDto } from './dtos/create-item.dto';
import { UpdateItemDto } from './dtos/update-item.dto';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'The item has been successfully created.', type: Item })
  create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.itemService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'Return all items.', type: [Item] })
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by id' })
  @ApiResponse({ status: 200, description: 'Return the item.', type: Item })
  @ApiResponse({ status: 404, description: 'Item not found.' })
  findOne(@Param('id') id: string): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully updated.', type: Item })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item' })
  @ApiResponse({ status: 200, description: 'The item has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.itemService.remove(id);
  }
}
