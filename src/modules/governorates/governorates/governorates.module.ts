import { Module } from '@nestjs/common';
import { GovernorateController } from './governorates.controller';
import { GovernorateService } from './governorates.service';
import { MongooseModule } from '@nestjs/mongoose';
import { GovernorateSchema, Governorate } from './schemas/governorates.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Governorate.name, schema: GovernorateSchema }])],
  controllers: [GovernorateController],
  providers: [GovernorateService]
})
export class GovernorateModule {}
