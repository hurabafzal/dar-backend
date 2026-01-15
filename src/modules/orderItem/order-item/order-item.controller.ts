import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { UpdateOrderItemDto } from './dtos/update-order-item.dto';
import { OrderItem } from './schemas/order-item.schema';

@ApiTags('order-items')
@Controller('order-items')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order item' })
  @ApiResponse({
    status: 201,
    description: 'Order item successfully created',
    type: OrderItem,
  })
  async create(
    @Body() createOrderItemDto: CreateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all order items' })
  @ApiResponse({
    status: 200,
    description: 'List of all order items',
    type: [OrderItem],
  })
  async findAll(): Promise<OrderItem[]> {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order item by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order item' })
  @ApiResponse({
    status: 200,
    description: 'The order item details',
    type: OrderItem,
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  async findOne(@Param('id') id: string): Promise<OrderItem> {
    return this.orderItemService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order item' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order item' })
  @ApiResponse({
    status: 200,
    description: 'Order item successfully updated',
    type: OrderItem,
  })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order item' })
  @ApiResponse({ status: 204, description: 'Order item successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order item not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderItemService.remove(id);
  }
}
