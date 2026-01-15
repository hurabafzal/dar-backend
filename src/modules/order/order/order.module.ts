import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderItemModule } from 'src/modules/orderItem/order-item/order-item.module';
import { InvoiceModule } from 'src/modules/invoice/order/invoice.module';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
    ]),
    OrderItemModule,
    InvoiceModule,
  ],
  exports: [OrderService],
})
export class OrderModule {}
