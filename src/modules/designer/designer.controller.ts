import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DesignersService } from './designer.service';
import { User } from 'src/modules/user/schemas/user.schema';

@ApiTags('Designers')
@Controller('designers')
export class DesignersController {
  constructor(private readonly designersService: DesignersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all designers' })
  @ApiResponse({ status: 200, description: 'List of designers', type: [User] })
  async findAll(): Promise<User[]> {
    return this.designersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a designer by ID' })
  @ApiParam({ name: 'id', description: 'Designer ID' })
  @ApiResponse({ status: 200, description: 'The designer details', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.designersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a designer by ID' })
  @ApiParam({ name: 'id', description: 'Designer ID' })
  @ApiResponse({ status: 200, description: 'The designer has been updated.', type: User })
  async update(@Param('id') id: string, @Body() updateDesignerDto: Partial<User>): Promise<User> {
    return this.designersService.update(id, updateDesignerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a designer by ID' })
  @ApiParam({ name: 'id', description: 'Designer ID' })
  @ApiResponse({ status: 200, description: 'The designer has been deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.designersService.remove(id);
  }
}

