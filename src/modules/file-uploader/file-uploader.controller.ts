import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Body,
  Get,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';

@Controller('file-uploader')
export class FileUploaderController {
  private s3: S3Client;
  private bucketName = process.env.S3_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  @Post()
  @ApiOperation({ summary: 'File Upload' })
  @ApiResponse({
    status: 201,
    description: 'File Upload successful.',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: any,
  ) {
    const fileKey = uuidv4();

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      Body: files[0].buffer,
      ContentType: files[0].mimetype,
    });

    await this.s3.send(command);

    return fileKey;
  }

  @Get()
  @ApiOperation({ summary: 'File Upload' })
  @ApiResponse({
    status: 201,
    description: 'File Upload successful.',
  })
  async findOne() {
    const signedUrl = getSignedUrl({
      keyPairId: process.env.CLOUDFRONT_KEYPAIR_ID,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY,
      url: `https://d3k9arqneg45sh.cloudfront.net/2c86af32-526c-4e98-977a-12d0acb6184d`,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    });

    return signedUrl;
  }

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          callback(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|mov|avi)$/)) {
          return callback(
            new BadRequestException('Only images and videos are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded!');
    }

    return {
      message: 'Files uploaded successfully',
      files: files.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        mimeType: file.mimetype,
        path: file.path,
      })),
    };
  }
}
