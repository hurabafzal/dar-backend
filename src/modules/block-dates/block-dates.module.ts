import { Module } from '@nestjs/common';
import { BlockDatesController } from './block-dates.controller';
import { BlockDatesService } from './block-dates.service';
import { BlockDate, BlockDateSchema } from './schemas/block-date.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockDateRange, BlockDateRangeSchema } from './schemas/block-date-range.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockDate.name, schema: BlockDateSchema },
      { name: BlockDateRange.name, schema: BlockDateRangeSchema },
    ]),
  ],
  controllers: [BlockDatesController],
  providers: [BlockDatesService],
  exports: [BlockDatesService],
})
export class BlockDatesModule {}
