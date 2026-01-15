import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { UpdateOrderItemDto } from './dtos/update-order-item.dto';
import { OrderItem, OrderItemDocument } from './schemas/order-item.schema';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectModel(OrderItem.name)
    private orderItemModel: Model<OrderItemDocument>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const createdOrderItem = new this.orderItemModel(createOrderItemDto);
    return createdOrderItem.save();
  }

  async createMany(createOrderItemDto: CreateOrderItemDto[]) {
    return await this.orderItemModel.insertMany(createOrderItemDto);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemModel.find().exec();
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.findById(id).exec();
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return orderItem;
  }

  async findOneByIdAndOrderId(id: string, orderId: string): Promise<OrderItem> {
    const orderItem = await this.orderItemModel.findOne({ id, orderId }).exec();
    return orderItem;
  }

  async update(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const updatedOrderItem = await this.orderItemModel
      .findByIdAndUpdate(id, updateOrderItemDto, { new: true })
      .exec();
    if (!updatedOrderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return updatedOrderItem;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderItemModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
  }
}
