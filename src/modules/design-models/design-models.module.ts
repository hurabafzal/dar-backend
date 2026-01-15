import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignModel, DesignModelSchema } from './schemas/design-model';
import { DesignModelController } from './design-model.controleer';
import { DesignModelService } from './design-model.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DesignModel.name, schema: DesignModelSchema },
    ]),
  ],
  controllers: [DesignModelController],
  providers: [DesignModelService],
  exports: [DesignModelService],
})
export class DesignModelModule {}
