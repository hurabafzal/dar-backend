import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { Sms, SmsSchema } from './schemas/sms.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sms.name, schema: SmsSchema }])],
  controllers: [SmsController],
  providers: [SmsService]
})
export class SmsModule {}
