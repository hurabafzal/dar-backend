import { Module } from '@nestjs/common';
import { ComponentPriceController } from './component-price.controller';
import { ComponentPriceService } from './component-price.service';

@Module({
  controllers: [ComponentPriceController],
  providers: [ComponentPriceService]
})
export class ComponentPriceModule {}
