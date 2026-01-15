import { Module } from '@nestjs/common';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { District, DistrictSchema } from './schemas/district.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: District.name, schema: DistrictSchema }])],
  controllers: [DistrictController],
  providers: [DistrictService]
})
export class DistrictModule {}
