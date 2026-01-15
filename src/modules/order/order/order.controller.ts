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
  Query,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { Order } from './schemas/order.schema';
import { GetOrdersQueryDto } from './dtos/get-orders-query.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Req } from '@nestjs/common';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({
    status: 201,
    description: 'Order successfully created',
    type: Order,
  })
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<Order> {
    return this.orderService.create(createOrderDto, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  async findAll(@Query() query: GetOrdersQueryDto): Promise<Order[]> {
    return this.orderService.findAll(query);
  }

  @Get('get-projects-count')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders',
    type: [Order],
  })
  async getProjectsCount(): Promise<{
    completedCount: number;
    readyToDeliverCount: number;
    pendingCount: number;
  }> {
    return this.orderService.getProjectsCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order' })
  @ApiResponse({ status: 200, description: 'The order details', type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Get('customer/:id')
  @ApiOperation({ summary: 'Get customer orders' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order' })
  @ApiResponse({ status: 200, description: 'The order details', type: Order })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  async findCustomerOrders(@Param('id') id: string): Promise<Order[]> {
    return this.orderService.findCustomerOrders(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing order' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order' })
  @ApiResponse({
    status: 200,
    description: 'Order successfully updated',
    type: Order,
  })
  @UseInterceptors(AnyFilesInterceptor())
  @ApiResponse({ status: 404, description: 'Order not found' })
  // order.controller.ts
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: any, // ✅ Request Object hinzufügen
  ): Promise<Order> {
    console.log('=== CONTROLLER DEBUG ===');
    console.log('files received:', files);
    console.log('req.files:', req.files); // ✅ Raw request files
    console.log('Content-Type:', req.headers['content-type']); // ✅ Content-Type prüfen
    
    return this.orderService.update(id, updateOrderDto, files);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the order' })
  @ApiResponse({ status: 204, description: 'Order successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
