import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DiscountCode,
  DiscountCodeSchema,
} from './schemas/discount-code.schema';
import { DiscountCodeController } from './discount-code.controller';
import { DiscountCodeService } from './discount-code.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiscountCode.name, schema: DiscountCodeSchema },
    ]),
  ],
  controllers: [DiscountCodeController],
  providers: [DiscountCodeService],
})
export class DiscountCodeModule {}
