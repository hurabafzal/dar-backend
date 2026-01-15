import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomersService } from './customer.service';
import { User } from '../../user/schemas/user.schema';

@ApiTags('Customers')
@Controller('customer')
export class CustomersController {
  constructor(private readonly customerService: CustomersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'The customer has been successfully created.', type: User })
  async create(@Body() createCustomerDto: Partial<User>): Promise<User> {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers', type: [User] })
  async findAll(): Promise<User[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'The customer details', type: User })
  async findOne(@Param('id') id: string): Promise<User> {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'The customer has been updated.', type: User })
  async update(@Param('id') id: string, @Body() updateCustomerDto: Partial<User>): Promise<User> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'The customer has been deleted.' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.customerService.remove(id);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Get multiple customers by IDs' })
  @ApiResponse({ status: 200, description: 'List of customers', type: [User] })
  async findMultiple(@Body() customerIds: string[]): Promise<User[]> {
    return this.customerService.findMultiple(customerIds);
  }
}
