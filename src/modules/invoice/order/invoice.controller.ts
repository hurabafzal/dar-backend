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
import { CreateInvoiceDto } from './dtos/create-invoice.dto';
import { UpdateInvoiceDto } from './dtos/update-invoice.dto';
import { Invoice } from './schemas/invoice.schema';
import { InvoiceService } from './invoice.service';
import { CreateChargeeDto } from './dtos/create-charge.dto';
import { CreateSmsDto } from './dtos/create-sms-dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoicesService: InvoiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({
    status: 201,
    description: 'Invoice successfully created',
    type: Invoice,
  })
  async create(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Post('send-sms')
  async sendSMS(@Body() createSmsDto: CreateSmsDto): Promise<any> {
    return this.invoicesService.sendSMS(createSmsDto);
  }

  @Post('create-charge')
  async createCharge(@Body() createChargeDto: CreateChargeeDto): Promise<any> {
    return this.invoicesService.createCharge(createChargeDto);
  }

  @Get('by-order-id/:orderId')
  @ApiOperation({ summary: 'Get all invoices by Order Id' })
  @ApiResponse({
    status: 200,
    description: 'List of all invoices',
    type: [Invoice],
  })
  async findAllByCustomerId(
    @Param('orderId') orderId: string,
  ): Promise<Invoice[]> {
    return this.invoicesService.findAllByCustomerId(orderId);
  }

  @Get('all-by-order-id/:orderId')
  @ApiOperation({ summary: 'Get all invoices by Order Id' })
  @ApiResponse({
    status: 200,
    description: 'List of all invoices',
    type: [Invoice],
  })
  async findInvoicesByOrderId(@Param('orderId') orderId: string): Promise<Invoice[]> {
    return this.invoicesService.findInvoicesByOrderId(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific invoice by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the invoice' })
  @ApiResponse({
    status: 200,
    description: 'The invoice details',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing invoice' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the invoice' })
  @ApiResponse({
    status: 200,
    description: 'Invoice successfully updated',
    type: Invoice,
  })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoicesService.update(id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an invoice by ID' })
  @ApiParam({ name: 'id', description: 'Unique identifier of the invoice' })
  @ApiResponse({ status: 204, description: 'Invoice successfully deleted' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.invoicesService.remove(id);
  }

  @Post('check-charge-status')
  @ApiOperation({ summary: 'Check charge status from Tap' })
  async checkChargeStatus(@Body() body: { chargeId: string }): Promise<any> {
    return this.invoicesService.checkChargeStatus(body.chargeId);
  }
}
