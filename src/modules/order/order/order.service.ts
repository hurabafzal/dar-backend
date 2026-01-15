import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dtos/create-order.dto';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { OrderItemService } from 'src/modules/orderItem/order-item/order-item.service';
import { InvoiceService } from 'src/modules/invoice/order/invoice.service';
import { EInvoiceStatus } from 'src/shared/enums/invoice-status.enum';
import { EOrderStatus } from 'src/shared/enums/order-status.enum';
import { GetOrdersQueryDto } from './dtos/get-orders-query.dto';
import { EUserType } from 'src/shared/enums/user-type.enum';
import {
  configureS3Client,
  constructCompletedInvoiceSms,
  constructInvoiceSms,
  constructProductionInvoiceSms,
  createCharge,
  deleteFile,
  sendSMS,
  toObjectId,
  uploadFiles,
} from 'src/shared/helper/helper';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly orderItemService: OrderItemService,
    private readonly invoiceService: InvoiceService,
  ) { }

  async create(createOrderDto: CreateOrderDto, files: any): Promise<Order> {
    let filesData = [];

    if (files) {
      const fileDetails = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));

      const client = configureS3Client();
      filesData = await uploadFiles(client, fileDetails);
    }

    const lastOrder = await this.orderModel
      .findOne()
      .sort({ createdAt: -1 })
      .exec();

    let newInvoiceNumber = 'SO_000001';
    if (lastOrder && lastOrder.invoiceNumber) {
      const lastSequence = parseInt(lastOrder.invoiceNumber.split('_')[1], 10);
      const newSequence = lastSequence + 1;
      newInvoiceNumber = `SO_${newSequence.toString().padStart(6, '0')}`;
    }

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      invoiceNumber: newInvoiceNumber,
      files: filesData,
    });

    let savedOrder = await createdOrder.save();
    const orderItems = createOrderDto.items.map((item) => ({
      orderId: savedOrder._id.toString(),
      itemId: item.itemId,
      quantity: item.quantity,
      description: item.description,
      price: item.price,
      isAdditional: item.isAdditional,
    }));

    await this.orderItemService.createMany(orderItems);

    return savedOrder;
  }

  async findAll(query: GetOrdersQueryDto): Promise<Order[]> {
    const { status, startDate, endDate } = query;
    const filter: Record<string, any> = {};

    if (status) filter.status = status;

    if (startDate || endDate) {
      filter.createdAt = {
        ...(startDate && { $gte: new Date(startDate) }),
        ...(endDate && { $lte: new Date(endDate) }),
      };
    }

    const orders = (await this.orderModel
      .find(filter)
      .populate('customerId')
      .lean()
      .exec()) as Order[];

    return orders?.map((order: Order) => ({
      ...order,
      files: order?.files?.filter((file: any) =>
        file.fileId &&
        file.fileId !== 'undefined' &&
        !file.fileId.startsWith('upload-') &&
        !file.fileId.startsWith('test-')
      ).map((file: any) => ({
        ...file,
        url: getSignedUrl({
          keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
          url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${file?.fileId}`,
          dateLessThan: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ).toISOString(),
        }),
      })),
    }));
  }

  async getProjectsCount(): Promise<{
    completedCount: number;
    readyToDeliverCount: number;
    pendingCount: number;
  }> {
    const orders = (await this.orderModel.find().lean().exec()) as Order[];

    const completedCount = orders.filter(
      (order) => order.status === EOrderStatus.COMPLETED,
    ).length;

    const readyToDeliverCount = orders.filter(
      (order) => order.status === EOrderStatus.READY_TO_DELIVER,
    ).length;

    const pendingCount = orders.filter(
      (order) =>
        ![
          EOrderStatus.COMPLETED,
          EOrderStatus.READY_TO_DELIVER,
          EOrderStatus.DELIVERED,
        ].includes(order.status),
    ).length;

    return {
      completedCount,
      readyToDeliverCount,
      pendingCount,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = (await this.orderModel
      .findById(toObjectId(id))
      .lean()
      .exec()) as Order;
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      ...order,
      files: order?.files?.map((file: any) => ({
        ...file,
        url: getSignedUrl({
          keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
          url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${file?.fileId}`,
          dateLessThan: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ).toISOString(),
        }),
      })),
    };
  }

  async findCustomerOrders(id: string): Promise<Order[]> {
    const orders = (await this.orderModel
      .find({ customerId: id })
      .populate('measurementId')
      .lean()
      .exec()) as Order[];
    if (!orders) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return orders?.map((order: Order) => ({
      ...order,
      files: order?.files?.map((file: any) => ({
        ...file,
        url: getSignedUrl({
          keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
          privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
          url: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${file?.fileId}`,
          dateLessThan: new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          ).toISOString(),
        }),
      })),
    }));
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, files?: Express.Multer.File[]): Promise<Order> {
    if (updateOrderDto.items && Array.isArray(updateOrderDto.items)) {
      updateOrderDto.items = updateOrderDto.items.map((item: any) => ({
        ...item,
        isAdditional: item.isAdditional ? (item.isAdditional === 'true' || item.isAdditional === true) : false,
        quantity: parseInt(item.quantity) || 1,
        price: parseFloat(item.price) || 0,
        amount: parseFloat(item.amount) || 0
      }));
    }

    const client = configureS3Client();
    const updateData = updateOrderDto as any;

    if (updateOrderDto.status?.toString() === "READY_TO_DELIVER") {
      updateData.construction = 1;
      updateData.appointmentRequested = 0;
      updateData.appointmentCreated = 0;
      updateData.appointmentDate = null;
      updateData.appointmentStartTime = null;
      updateData.appointmentEndTime = null;
    } else if (updateOrderDto.status) {
      updateData.construction = 0;
      updateData.appointmentRequested = 0;
      updateData.appointmentCreated = 0;
      updateData.appointmentDate = null;
      updateData.appointmentStartTime = null;
      updateData.appointmentEndTime = null;
    }

    if (updateData.orderInfo?.isAdditional === "") {
      delete updateData.orderInfo.isAdditional;
    }

    if (typeof updateData.designDetails === 'string') {
      delete updateData.designDetails;
    }
    if (typeof updateData.fullModelData === 'string') {
      delete updateData.fullModelData;
    }

    const order = (await this.orderModel
      .findByIdAndUpdate(toObjectId(id), updateData, { new: true })
      .populate('measurementId')
      .exec()) as any;

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order?.files && order?.files?.length > 0) {
      const existingFileIds = new Set(
        JSON.parse(updateOrderDto.existingFiles || '[]')?.map((file) => file.fileId),
      );
      const filesToDelete = order.files.filter(
        (file) => !existingFileIds.has(file.fileId),
      );
      await Promise.all(
        filesToDelete.map((file) => deleteFile(client, file.fileId)),
      );
      order.files = order.files.filter((file) =>
        existingFileIds.has(file.fileId),
      );
    }

    if (updateOrderDto.items) {
      for (const item of updateOrderDto.items) {
        const existingItem = await this.orderItemService.findOneByIdAndOrderId(
          item.itemId,
          order._id.toString(),
        );
        if (existingItem) {
          if (parseInt(item.quantity) === 0) {
            await this.orderItemService.remove(existingItem._id.toString());
          } else {
            await this.orderItemService.update(existingItem._id.toString(), {
              quantity: parseInt(item.quantity),
              isAdditional: item.isAdditional
            });
          }
        } else {
          if (parseInt(item.quantity) > 0) {
            await this.orderItemService.create({
              orderId: id,
              itemId: item.itemId,
              quantity: item.quantity,
              description: item.description,
              price: item.price,
              isAdditional: item.isAdditional
            });
          }
        }
      }
    }

    if (updateOrderDto.totalAmount) {
      order.totalAmount = parseInt(updateOrderDto.totalAmount);
    }

    if (updateOrderDto.status) {
      order.status = updateOrderDto.status;
    }

    if (updateOrderDto.paymentTerms) {
      order.paymentTerms = updateOrderDto.paymentTerms;
    }

    if (updateOrderDto.measurementId) {
      order.measurementId = new Types.ObjectId(updateOrderDto.measurementId);
    }

    let newFiles = [];
    if (files && files.length > 0) {
      const fileDetails = files.map((file) => ({
        originalname: file.originalname,
        mimetype: file.mimetype,
        buffer: file.buffer,
      }));

      try {
        newFiles = await uploadFiles(client, fileDetails);
        console.log('✅ FILES UPLOADED TO S3:', newFiles);
      } catch (error) {
        console.error('❌ S3 UPLOAD ERROR:', error);
        throw new Error('Failed to upload files to S3');
      }
    } else {
      console.log('❌ NO FILES TO PROCESS - files param is empty');
    }

    order.files = order?.files ? [...order.files, ...newFiles] : [...newFiles];

    await order.save();

    return order;
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
