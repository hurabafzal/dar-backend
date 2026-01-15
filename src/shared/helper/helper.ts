import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { parseISO, format } from 'date-fns';
import * as twilio from 'twilio';
import axios from 'axios';
import PDFDocument = require('pdfkit');

export function configureS3Client() {
  const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  return client;
}

export function toObjectId(id: string): Types.ObjectId {
  try {
    return new Types.ObjectId(id);
  } catch (error) {
    throw new NotFoundException(`Invalid ID format: ${id}`);
  }
}

export async function uploadFiles(
  client: S3Client,
  files: (Express.Multer.File | any)[], // ← Erlaubt beide Types
) {
  try {
    const filesData = files.map(async (file: any) => { // ← any verwenden
      const fileKey = uuidv4();

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype || file.type,
      });

      await client.send(command);

      return {
        originalName: file.originalname || file.name || 'unknown',
        mimeType: file.mimetype || file.type || 'application/octet-stream',
        fileId: fileKey,
      };
    });

    return await Promise.all(filesData);
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadModels(
  client: S3Client,
  files: Express.Multer.File[],
) {
  try {
    const filesData = files.map(async (file: Express.Multer.File) => {
      const command = new PutObjectCommand({
        Bucket: process.env.MODELS_BUCKET_NAME,
        Key: `cabinets/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await client.send(command);

      return {
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileId: file.originalname,
      };
    });

    return await Promise.all(filesData);
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadModelFile(
  client: S3Client,
  file: Express.Multer.File,
  prefix: string,
) {
  try {
    const fileKey = uuidv4();

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${prefix}/${fileKey}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await client.send(command);

    return fileKey;
  } catch (error) {
    throw new Error(error);
  }
}

export async function listCabinetFiles(client: S3Client) {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.MODELS_BUCKET_NAME,
      Prefix: 'cabinets/',
    });

    const response = await client.send(command);

    const files =
      response.Contents?.map((item) => item.Key.split('/')[1]) || [];
    const sortedFiles = files.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
    return sortedFiles;
  } catch (error) {
    throw error;
  }
}
export async function deleteFile(
  s3Client: S3Client,
  fileId: string,
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileId,
  });

  await s3Client.send(command);
}

export async function deleteModel(
  s3Client: S3Client,
  fileId: string,
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.MODELS_BUCKET_NAME,
    Key: `cabinets/${fileId}`,
  });

  await s3Client.send(command);
}

export async function deleteModelFile(
  s3Client: S3Client,
  fileId: string,
  prefix: string,
): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${prefix}/${fileId}`,
  });

  await s3Client.send(command);
}

export function formatDate(date: Date | string): string {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss'+03:00'");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function sendSMS(
  toNumber: string,
  amount: string,
  chargeUrl: string,
  template: string,
): Promise<any> {
  try {
    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_ACCOUNT_AUTH_TOKEN,
    );

    const message = await twilioClient.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${toNumber}`,
      contentSid:
        template === 'initial_invoice'
          ? `${process.env.TWILIO_INITIAL_CONTENT_SID}`
          : template === 'production_invoice'
            ? `${process.env.TWILIO_PRODUCTION_CONTENT_SID}`
            : `${process.env.TWILIO_COMPLETED_CONTENT_SID}`,
      body: '',
      persistentAction: [`template:${template}`],
      contentVariables: JSON.stringify({
        1: amount,
        2: chargeUrl,
      }),
    });

    return message;
  } catch (error) {
    return error;
  }
}

export async function sendQuotationWhatsApp(
  toNumber: string,
  quotationId: string,
  customerName: string,
  quotationDate: string,
  totalAmount: string,
  downloadUrl: string,
  template: string = 'copy-quotation',
): Promise<any> {
  try {
    console.log('📱 sendQuotationWhatsApp called with:', {
      toNumber,
      quotationId,
      customerName,
      quotationDate,
      totalAmount,
      downloadUrl,
      template
    });

    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_ACCOUNT_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    const contentSid = template === 'copy-quotation' || template === 'copy_quotation'
      ? `${process.env.TWILIO_QUOTATION_CONTENT_SID}` 
      : template === 'initial_invoice'
        ? `${process.env.TWILIO_INITIAL_CONTENT_SID}`
        : template === 'production_invoice'
          ? `${process.env.TWILIO_PRODUCTION_CONTENT_SID}`
          : `${process.env.TWILIO_COMPLETED_CONTENT_SID}`;

    console.log('🔑 Twilio config check:', {
      hasAccountSid: !!twilioAccountSid,
      hasAuthToken: !!twilioAuthToken,
      hasPhoneNumber: !!twilioPhoneNumber,
      contentSid: contentSid
    });

    if (!twilioAccountSid || !twilioAuthToken) {
      console.error('❌ Twilio credentials missing!');
      return { success: false, error: 'Twilio credentials not configured' };
    }

    const twilioClient = twilio(twilioAccountSid, twilioAuthToken);

    const whatsappToNumber = `whatsapp:${toNumber}`;
    const whatsappFromNumber = `whatsapp:${twilioPhoneNumber}`;

    // Prepare content variables
    // IMPORTANT: Twilio Content Template variable mapping:
    // Variable 1: customerName
    // Variable 2: quotationId
    // Variable 3: quotationDate
    // Variable 4: totalAmount
    // Variable 5: downloadUrl (FULL URL including domain)
    // 
    // The Twilio template MUST use {{5}} for the download URL, NOT a hardcoded placeholder
    const contentVariables = {
      1: customerName,  
      2: quotationId,    
      3: quotationDate,  
      4: totalAmount,
      5: downloadUrl,  // Full URL: https://darkw.ai/api/quotations/{quotationId}/download
    };

    console.log('📤 Sending WhatsApp message:', {
      from: whatsappFromNumber,
      to: whatsappToNumber,
      contentSid: contentSid,
      contentVariables: contentVariables
    });

    console.log('📋 Content Variables JSON:', JSON.stringify(contentVariables, null, 2));
    console.log('🔗 Download URL being sent:', downloadUrl);
    console.log('🆔 Quotation ID being sent:', quotationId);

    const message = await twilioClient.messages.create({
      from: whatsappFromNumber,
      to: whatsappToNumber,
      contentSid: contentSid,
      body: '',
      persistentAction: [`template:${template}`],
      contentVariables: JSON.stringify(contentVariables),
    });

    console.log('✅ WhatsApp message sent successfully:', {
      messageSid: message.sid,
      status: message.status,
      to: message.to,
      from: message.from
    });

    return { success: true, message };
  } catch (error: any) {
    console.error('❌ Error sending WhatsApp message - Raw error:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error constructor:', error?.constructor?.name);
    console.error('❌ Error keys:', error ? Object.keys(error) : []);
    
    // Handle Twilio-specific errors
    let errorMessage = 'Unknown error';
    let errorCode = null;
    let errorStatus = null;
    
    // Check multiple possible error structures
    if (error?.code && error?.message) {
      // Twilio error object (most common)
      errorMessage = error.message;
      errorCode = error.code;
      errorStatus = error.status || error.httpStatusCode;
      console.error('❌ Twilio Error Object:', {
        code: errorCode,
        message: errorMessage,
        status: errorStatus,
        moreInfo: error.moreInfo
      });
    } else if (error?.response?.data) {
      // Twilio API error response (HTTP error)
      const data = error.response.data;
      errorMessage = data.message || data.error || JSON.stringify(data);
      errorCode = data.code || error.response.status;
      errorStatus = error.response.status;
      console.error('❌ Twilio API Error Response:', {
        status: errorStatus,
        code: errorCode,
        message: errorMessage,
        fullResponse: data
      });
    } else if (error?.message) {
      // Standard Error object
      errorMessage = error.message;
      errorCode = error.code || null;
      errorStatus = error.status || null;
      console.error('❌ Standard Error:', errorMessage);
    } else if (typeof error === 'string') {
      errorMessage = error;
      console.error('❌ String Error:', errorMessage);
    } else {
      // Try to stringify the whole error
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = String(error) || 'Unknown error occurred';
      }
      console.error('❌ Unknown Error Format:', error);
    }
    
    // Log full error details
    console.error('❌ Full Error Details:', {
      message: errorMessage,
      code: errorCode,
      status: errorStatus,
      errorObject: error,
      stack: error?.stack || 'No stack trace'
    });
    
    return { 
      success: false, 
      error: errorMessage,
      code: errorCode,
      status: errorStatus,
      rawError: error // Include raw error for debugging
    };
  }
}

export function generateQuotationPDF(quotation: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      console.log('📄 generateQuotationPDF called with quotation:', {
        id: quotation._id?.toString(),
        name: quotation.name,
        phone: quotation.phone,
        itemsCount: quotation.items?.length || 0,
        totalAmount: quotation.totalAmount
      });

      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      });
      
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        console.log('✅ PDF document generated, buffer size:', pdfBuffer.length, 'bytes');
        resolve(pdfBuffer);
      });
      
      doc.on('error', (error: Error) => {
        console.error('❌ PDF document error:', error);
        reject(error);
      });

      // Header
      doc.fontSize(20).text('DAR Kuwait', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(16).text('Quotation', { align: 'center' });
      doc.moveDown(1);

      // Customer Information
      doc.fontSize(12);
      doc.text(`Customer Name: ${quotation.name || 'N/A'}`);
      doc.text(`Phone: ${quotation.phone || 'N/A'}`);
      doc.text(`Date: ${quotation.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : 'N/A'}`);
      doc.text(`Quotation ID: ${quotation._id?.toString() || 'N/A'}`);
      doc.moveDown(1);

      // Items Table Header
      doc.fontSize(10);
      const tableTop = doc.y;
      doc.text('Item', 50, tableTop);
      doc.text('Description', 150, tableTop);
      doc.text('Quantity', 350, tableTop);
      doc.text('Price', 420, tableTop);
      doc.text('Amount', 480, tableTop);
      
      // Draw line under header
      doc.moveTo(50, doc.y + 5)
        .lineTo(550, doc.y + 5)
        .stroke();
      
      doc.moveDown(0.5);

      // Items
      let yPosition = doc.y;
      if (quotation.items && quotation.items.length > 0) {
        quotation.items.forEach((item: any, index: number) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }
          
          const quantity = item.quantity || '1';
          const price = parseFloat(item.price || '0');
          const amount = parseFloat(quantity) * price;

          doc.text(item.item || 'N/A', 50, yPosition, { width: 90 });
          doc.text(item.description || 'N/A', 150, yPosition, { width: 190 });
          doc.text(quantity, 350, yPosition);
          doc.text(`${price.toFixed(3)} KWD`, 420, yPosition);
          doc.text(`${amount.toFixed(3)} KWD`, 480, yPosition);
          
          yPosition += 20;
        });
      }

      doc.moveDown(1);

      // Totals
      const totalsY = doc.y;
      doc.moveTo(350, totalsY)
        .lineTo(550, totalsY)
        .stroke();
      
      doc.moveDown(0.5);
      doc.fontSize(12);
      
      if (quotation.grossAmount) {
        doc.text(`Gross Amount: ${quotation.grossAmount.toFixed(3)} KWD`, { align: 'right' });
      }
      
      if (quotation.discount && quotation.discount > 0) {
        doc.text(`Discount: ${quotation.discount.toFixed(3)} KWD`, { align: 'right' });
      }
      
      doc.fontSize(14).font('Helvetica-Bold');
      doc.text(`Total Amount: ${quotation.totalAmount.toFixed(3)} KWD`, { align: 'right' });
      
      doc.moveDown(1);
      
      if (quotation.comments) {
        doc.fontSize(10).font('Helvetica');
        doc.text('Comments:', 50);
        doc.text(quotation.comments, 50, doc.y, { width: 500 });
      }

      // Footer
      doc.fontSize(8).font('Helvetica');
      doc.text('Thank you for choosing DAR Kuwait!', { align: 'center' });
      doc.text('Visit us at dar-kuwait.com', { align: 'center' });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function createCharge(
  amount: number,
  user?: any,
  designId?: string
): Promise<string> {
  try {
    const headers = {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${process.env.TAP_PUBLIC_KEY}`,
    };

    const url = 'https://api.tap.company/v2/charges/';
    const payload = {
      amount,
      currency: 'KWD',
      customer_initiated: true,
      threeDSecure: true,
      save_card: false,
      description: 'Test Description',
      metadata: { udf1: 'Metadata 1' },
      receipt: { email: false, sms: false },
      reference: { transaction: 'txn_01', order: 'ord_01' },
      customer: {
        first_name: user?.userName || 'test',
        middle_name: user?.userName || 'test',
        last_name: user?.userNamee || 'test',
        email: user?.email || 'test@test.com',
        phone: { 
          country_code: '965',
          number: user?.phone?.replace(/^965/, '') || '12345678'
        },
      },
      merchant: { id: '20497145' }, 
      source: { id: 'src_all' }, 
      redirect: { url: `https://dar-kuwait.com/login?tx_darwebsite_loginform%5Baction%5D=loginSuccess&tx_darwebsite_loginform%5Bcontroller%5D=Login&cHash=152091ea900ff2008cb7086cf1ca7cce` },
    };                  
    const res = await axios.post(url, payload, {
      headers,
    });

    return res.data;
  } catch (error) {
    console.error('Tap error response:', error.response.data);
    return error;
  }
}

export async function retrieveCharge(chargeId: string): Promise<any> {
  console.log('🔍 retrieveCharge called with:', chargeId);
  const options = {
    method: 'GET',
    url: `https://api.tap.company/v2/charges/${chargeId}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TAP_PUBLIC_KEY}`,
    },
  };

  try {
    const response = await axios.request(options);
    console.log('🔍 retrieveCharge response:', response);
    return response.data;
  } catch (error) {
    console.error('Error retrieving charge:', error);
    throw error;
  }
}

export const constructInvoiceSms = (chargeUrl: string, amount: number) => {
  return `Your Order has been received. Please pay the amount of KWD ${amount} using this link for order confirmation\n\n ${chargeUrl}\n\n Thanks for choosing DAR.`;
};

export const constructProductionInvoiceSms = (
  chargeUrl: string,
  amount: number,
) => {
  return `Design for your order has been completed. Please pay the amount of KWD ${amount} using this link for initiating the production phase\n\n ${chargeUrl}\n\n Thanks for choosing DAR.`;
};

export const constructCompletedInvoiceSms = (
  chargeUrl: string,
  amount: number,
) => {
  return `Production for your order has been completed. Please pay the amount of KWD ${amount} using this link for making it ready for delivery\n\n ${chargeUrl}\n\n Thanks for choosing DAR.`;
};
