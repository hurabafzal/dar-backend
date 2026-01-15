import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Measurment, MeasurmentSchema } from './schemas/measurment.schema';
import { MeasurmentController } from './measurment.controller';
import { MeasurmentService } from './measurment.service';
import { ItemModule } from 'src/modules/item/item.module';
import { ModelModule } from 'src/modules/model/model.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Measurment.name, schema: MeasurmentSchema }]), ItemModule, ModelModule],
  controllers: [MeasurmentController],
  providers: [MeasurmentService],
  exports: [MeasurmentService],
})
export class MeasurmentModule {}
