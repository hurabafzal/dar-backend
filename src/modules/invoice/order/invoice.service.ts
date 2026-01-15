import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { retrieveCharge } from 'src/shared/helper/helper';
import {
  constructInvoiceSms,
  createCharge,
  sendSMS,
} from 'src/shared/helper/helper';
import { CreateChargeeDto } from './dtos/create-charge.dto';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { CreateSmsDto } from './dtos/create-sms-dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoice = new this.invoiceModel(createInvoiceDto);
    return invoice.save();
  }

  async sendSMS(createSmsDto: CreateSmsDto): Promise<any> {
    const user = await this.userModel.findById(createSmsDto.customerId);
    const number = `${process.env.COUNTRY_CODE}${user?.phone}`;

    return await sendSMS(
      number,
      createSmsDto.amount.toString(),
      createSmsDto.chargeUrl,
      "initial_invoice"
    );
  }

  async createCharge(createChargeDto: CreateChargeeDto): Promise<any> {
    try {
      const user = await this.userModel.findById(createChargeDto.customerId);
      const paymentResponse = await createCharge(createChargeDto.amount, user, createChargeDto.designId);
      
      // Payment Link extrahieren
      const paymentLink = (paymentResponse as any)?.transaction?.url;
      
      await this.sendSMS({
        customerId: createChargeDto.customerId,
        amount: createChargeDto.amount,
        chargeUrl: paymentLink,
      });

      const invoice = new this.invoiceModel({
        orderId: createChargeDto.orderId,
        totalAmount: createChargeDto.amount,
        paidAmount: 0,
        status: 'MEASUREMENT',
        chargeId: (paymentResponse as any).id,
        chargeType: createChargeDto.invoiceType,
        tapPaymentLink: paymentLink
      });
      
      const savedInvoice = await invoice.save();;
      
      return paymentResponse;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }

  async findAllByCustomerId(orderId: string): Promise<Invoice[]> {
    return this.invoiceModel.find({ orderId }).exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async findOneByOrderId(orderId: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findOne({ orderId }).exec();
    return invoice;
  }

  async checkChargeStatus(chargeId: string): Promise<any> {
    return await retrieveCharge(chargeId);
  }

  async findInvoicesByOrderId(orderId: string): Promise<Invoice[]> {
    const invoices = await this.invoiceModel.find({ orderId }).exec();
    const updatedInvoices = await Promise.all(
      invoices.map(async (invoice) => {
        try {
          const chargeData = await retrieveCharge(invoice.chargeId);
          return {
            ...invoice.toObject(),
            chargeStatus: chargeData.status,
            chargeAmount: chargeData.amount,
          };
        } catch (error) {
          return invoice.toObject();
        }
      }),
    );

    return updatedInvoices;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    
    // ✅ DEBUG: Schauen was ankommt
    console.log('🔍 UPDATE DEBUG:');
    console.log('updateInvoiceDto:', updateInvoiceDto);
    console.log('status:', updateInvoiceDto.status);
    console.log('status type:', typeof updateInvoiceDto.status);
    console.log('status toString:', updateInvoiceDto.status?.toString());
    
    // ✅ Construction Logik
    if (updateInvoiceDto.status?.toString() === "READY_TO_DELIVER") {
      console.log('✅ Setting construction to 1');
      (updateInvoiceDto as any).construction = 1;
    } else if (updateInvoiceDto.status) {
      console.log('✅ Setting construction to 0');
      (updateInvoiceDto as any).construction = 0;
    }
    
    // ✅ DEBUG: Schauen was gesetzt wird
    console.log('Final updateInvoiceDto:', updateInvoiceDto);

    const invoice = await this.invoiceModel
      .findByIdAndUpdate(id, updateInvoiceDto, { new: true })
      .exec();
      
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    
    // ✅ DEBUG: Schauen was zurückkommt
    console.log('Updated invoice:', invoice);
    
    return invoice;
  }

  async remove(id: string): Promise<void> {
    const result = await this.invoiceModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }
}
