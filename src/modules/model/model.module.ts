import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { MaterialModule } from '../material/material/material.module';
import { ModelSchema } from './schemas/model.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]), MaterialModule],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
