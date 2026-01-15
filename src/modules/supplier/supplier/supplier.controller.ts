import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { User } from '../../user/schemas/user.schema';

@ApiTags('Supplier')
@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'List of suppliers', type: [User] })
  async findAll(): Promise<User[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a supplier by ID' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'The supplier details', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.supplierService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'The supplier has been created.', type: User })
  async create(@Body() createSupplierDto: Partial<User>): Promise<User> {
    return this.supplierService.create(createSupplierDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a supplier by ID' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'The supplier has been updated.', type: User })
  async update(@Param('id') id: string, @Body() updateSupplierDto: Partial<User>): Promise<User> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a supplier by ID' })
  @ApiParam({ name: 'id', description: 'Supplier ID' })
  @ApiResponse({ status: 200, description: 'The supplier has been deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.supplierService.remove(id);
  }
}

