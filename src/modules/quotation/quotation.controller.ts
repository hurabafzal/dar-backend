import { Controller, Get, Post, Put, Body, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { QuotationService } from './quotation.service';
import { CreateQuotationDto } from './dtos/create-quotation.dto';
import { Quotation } from './schemas/quotation.schema';

@Controller('quotations')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post()
  async create(
    @Body() createQuotationDto: CreateQuotationDto,
  ): Promise<Quotation> {
    return this.quotationService.create(createQuotationDto);
  }

  @Get()
  async findAll(): Promise<Quotation[]> {
    return this.quotationService.findAll();
  }

  // CRITICAL: This route MUST be defined before @Get(':id') to work
  // NestJS matches routes in order, so more specific routes must come first
  @Get(':id/download')
  async downloadPDF(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log('📥 Download PDF request received');
    console.log('🔍 Quotation ID from params:', id);
    console.log('🔍 Request URL:', `/api/quotations/${id}/download`);
    
    try {
      console.log('🔎 Searching for quotation with ID:', id);
      const quotation = await this.quotationService.findById(id);
      
      if (!quotation) {
        console.error('❌ Quotation not found with ID:', id);
        throw new NotFoundException(`Quotation with ID ${id} not found`);
      }
      
      console.log('✅ Quotation found:', {
        id: quotation._id?.toString(),
        name: quotation.name,
        phone: quotation.phone,
        totalAmount: quotation.totalAmount
      });

      console.log('📄 Generating PDF for quotation:', quotation._id?.toString());
      const pdfBuffer = await this.quotationService.generatePDF(quotation);
      
      if (!pdfBuffer || pdfBuffer.length === 0) {
        console.error('❌ PDF buffer is empty or null');
        throw new Error('Failed to generate PDF');
      }
      
      console.log('✅ PDF generated successfully, size:', pdfBuffer.length, 'bytes');
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="quotation-${id}.pdf"`);
      console.log('📤 Sending PDF response to client');
      res.send(pdfBuffer);
      console.log('✅ PDF sent successfully');
    } catch (error) {
      console.error('❌ Error in downloadPDF endpoint:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      if (error instanceof NotFoundException) {
        res.status(404).json({
          message: error.message,
          error: 'Not Found',
          statusCode: 404
        });
        return;
      }
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({
        message: `Failed to download quotation: ${errorMessage}`,
        error: 'Internal Server Error',
        statusCode: 500
      });
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Quotation> {
    return this.quotationService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuotationDto: Partial<CreateQuotationDto>,
  ): Promise<Quotation> {
    return this.quotationService.update(id, updateQuotationDto);
  }
}