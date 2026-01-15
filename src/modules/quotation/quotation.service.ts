import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quotation, QuotationDocument } from './schemas/quotation.schema';
import { CreateQuotationDto } from './dtos/create-quotation.dto';
import { sendQuotationWhatsApp, generateQuotationPDF } from 'src/shared/helper/helper';

@Injectable()
export class QuotationService {
  constructor(
    @InjectModel(Quotation.name)
    private readonly quotationModel: Model<QuotationDocument>,
  ) {}

  async create(dto: CreateQuotationDto): Promise<Quotation> {
    console.log('📝 Creating quotation with data:', JSON.stringify(dto, null, 2));
    
    // Calculate total amount from items (considering quantity)
    if (dto.items && dto.items.length > 0) {
      const calculatedTotal = dto.items.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity || '1');
        const price = parseFloat(item.price || '0');
        const itemAmount = quantity * price;
        console.log(`📊 Item: ${item.item}, Quantity: ${quantity}, Price: ${price}, Amount: ${itemAmount}`);
        return sum + itemAmount;
      }, 0);
      
      dto.totalAmount = calculatedTotal;
      dto.grossAmount = calculatedTotal;
      console.log('💰 Calculated total amount:', calculatedTotal);
    }
    
    // 1. Quotation erstellen
    const quotation = await this.quotationModel.create(dto);
    console.log('✅ Quotation created with ID:', quotation._id.toString());

    // 2. WhatsApp senden (nur wenn Phone-Nummer vorhanden)
    if (quotation.phone) {
      try {
        console.log('📞 Processing phone number:', quotation.phone);
        
        // Handle phone number formatting
        let number: string;
        const phone = quotation.phone.trim();
        
        // Check if number already starts with +92 (Pakistan) or +965 (Kuwait)
        if (phone.startsWith('+92')) {
          // Pakistan number - use as is
          number = phone;
          console.log('🇵🇰 Detected Pakistan number, using as is:', number);
        } else if (phone.startsWith('+965')) {
          // Kuwait number with +965 - use as is
          number = phone;
          console.log('🇰🇼 Detected Kuwait number with +965, using as is:', number);
        } else if (phone.startsWith('965')) {
          // Kuwait number without + - add +
          number = `+${phone}`;
          console.log('🇰🇼 Detected Kuwait number without +, adding +:', number);
        } else {
          // Default: add country code (Kuwait)
          number = `${process.env.COUNTRY_CODE}${phone}`;
          console.log('🇰🇼 Adding default country code:', process.env.COUNTRY_CODE, 'Result:', number);
        }
        
        // Generate download URL - use backend URL
        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3501}`;
        const downloadUrl = `${backendUrl}/api/quotations/${quotation._id.toString()}/download`;
        console.log('🔗 Generated download URL:', downloadUrl);
        
        console.log('📤 Sending WhatsApp with params:', {
          toNumber: number,
          quotationId: quotation._id.toString(),
          customerName: quotation.name,
          date: new Date().toLocaleDateString(),
          totalAmount: quotation.totalAmount.toString(),
          downloadUrl: downloadUrl
        });
        
        const whatsappResult = await sendQuotationWhatsApp(
          number,
          quotation._id.toString(),
          quotation.name,
          new Date().toLocaleDateString(),
          quotation.totalAmount.toString(),
          downloadUrl,
          "copy-quotation"
        );

        console.log('📱 WhatsApp API Response (raw):', whatsappResult);
        console.log('📱 WhatsApp API Response (stringified):', JSON.stringify(whatsappResult, null, 2));
        console.log('📱 WhatsApp Result Type:', typeof whatsappResult);
        console.log('📱 WhatsApp Result is null/undefined:', whatsappResult == null);
        if (whatsappResult) {
          console.log('📱 WhatsApp Result Keys:', Object.keys(whatsappResult));
          console.log('📱 WhatsApp Result has success:', 'success' in whatsappResult);
          console.log('📱 WhatsApp Result.success value:', whatsappResult.success);
          console.log('📱 WhatsApp Result.error value:', whatsappResult.error);
        }

        // Check if result indicates success
        const isSuccess = whatsappResult && (
          whatsappResult.success === true || 
          (whatsappResult.sid && !whatsappResult.error) // Twilio message object
        );

        if (isSuccess) {
          console.log('✅ WhatsApp sent successfully for quotation:', quotation._id);
          const messageSid = whatsappResult.sid || whatsappResult.message?.sid || 'N/A';
          console.log('✅ Message SID:', messageSid);
        } else {
          // Extract error message from various possible structures
          let errorMsg = 'Unknown error';
          let errorCode = 'N/A';
          let errorStatus = 'N/A';
          
          if (whatsappResult) {
            errorMsg = whatsappResult.error || 
                      whatsappResult.message || 
                      whatsappResult.toString() || 
                      JSON.stringify(whatsappResult);
            errorCode = whatsappResult.code || 'N/A';
            errorStatus = whatsappResult.status || 'N/A';
          } else {
            errorMsg = 'WhatsApp function returned null/undefined';
          }
          
          console.error('❌ Failed to send WhatsApp:', {
            error: errorMsg,
            code: errorCode,
            status: errorStatus,
            fullResult: whatsappResult
          });
        }
      } catch (error) {
        // WhatsApp Fehler soll Quotation-Erstellung nicht blockieren
        console.error('❌ WhatsApp error (non-blocking):', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      }
    } else {
      console.log('⚠️ No phone number provided, skipping WhatsApp');
    }

    console.log('📞 Final quotation data:', {
      id: quotation._id.toString(),
      phone: quotation.phone,
      name: quotation.name,
      totalAmount: quotation.totalAmount
    });
    
    return quotation;
  }

  async findAll(): Promise<Quotation[]> {
    return this.quotationModel.find().exec();
  }

  async findById(id: string): Promise<Quotation> {
    console.log('🔍 QuotationService.findById called with ID:', id);
    const quotation = await this.quotationModel.findById(id).exec();
    
    if (quotation) {
      console.log('✅ Quotation found in database:', quotation._id?.toString());
    } else {
      console.log('❌ Quotation not found in database for ID:', id);
    }
    
    return quotation;
  }

  async update(id: string, updateData: Partial<CreateQuotationDto>): Promise<Quotation> {
    try {
      // Calculate totals if items are provided (considering quantity)
      if (updateData.items) {
        const calculatedTotal = updateData.items.reduce((sum, item) => {
          const quantity = parseFloat(item.quantity || '1');
          const price = parseFloat(item.price || '0');
          const itemAmount = quantity * price;
          console.log(`📊 Update - Item: ${item.item}, Quantity: ${quantity}, Price: ${price}, Amount: ${itemAmount}`);
          return sum + itemAmount;
        }, 0);
        
        updateData.totalAmount = calculatedTotal;
        updateData.grossAmount = calculatedTotal;
        console.log('💰 Updated total amount:', calculatedTotal);
      }

      const updatedQuotation = await this.quotationModel
        .findByIdAndUpdate(id, updateData, { 
          new: true,
          runValidators: true
        })
        .exec();

      if (!updatedQuotation) {
        throw new NotFoundException(`Quotation with ID ${id} not found`);
      }

      return updatedQuotation;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to update quotation: ${error.message}`);
    }
  }

  async generatePDF(quotation: Quotation): Promise<Buffer> {
    console.log('📄 QuotationService.generatePDF called for quotation:', quotation._id?.toString());
    try {
      const pdfBuffer = await generateQuotationPDF(quotation);
      console.log('✅ PDF generated successfully, buffer size:', pdfBuffer?.length || 0, 'bytes');
      return pdfBuffer;
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      console.error('❌ Error message:', error instanceof Error ? error.message : String(error));
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }
}