import { Module } from '@nestjs/common';
import { ShippingInfoController } from './shipping-info.controller';
import { ShippingInfoService } from './shipping-info.service';

@Module({
  controllers: [ShippingInfoController],
  providers: [ShippingInfoService]
})
export class ShippingInfoModule {}
