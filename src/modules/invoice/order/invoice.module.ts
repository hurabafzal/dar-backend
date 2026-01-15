import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  controllers: [InvoiceController],
  providers: [InvoiceService],
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  exports: [InvoiceService],
})
export class InvoiceModule {}
