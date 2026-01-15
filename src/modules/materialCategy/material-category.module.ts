import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MaterialCategory,
  MaterialCategorySchema,
} from './schemas/material-category';
import { MaterialCategoryController } from './material-category.controller';
import { MaterialCategoryService } from './material-category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaterialCategory.name, schema: MaterialCategorySchema },
    ]),
  ],
  controllers: [MaterialCategoryController],
  providers: [MaterialCategoryService],
  exports: [MaterialCategoryService],
})
export class MaterialCategoryModule {}
