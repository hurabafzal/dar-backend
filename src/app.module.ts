import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth/auth.module';
import { MaterialModule } from './modules/material/material/material.module';
import { ItemModule } from './modules/item/item.module';
import { MeasurmentModule } from './modules/measurment/measurment/measurment.module';
import { QuotationModule } from './modules/quotation/quotation.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GovernorateModule } from './modules/governorates/governorates/governorates.module';
import { AppointmentsModule } from './modules/appointments/appointments/appointments.module';
import { OrderModule } from './modules/order/order/order.module';
import { OrderItemModule } from './modules/orderItem/order-item/order-item.module';
import { DistrictModule } from './modules/district/district.module';
import { BlockDatesModule } from './modules/block-dates/block-dates.module';
import { UserGroupsModule } from './modules/userGroups/user-groups/user-groups.module';
import { CustomersModule } from './modules/customer/customer/customer.module';
import { SupplierModule } from './modules/supplier/supplier/supplier.module';
import { DesignersModule } from './modules/designer/designer.module';
import { ModelModule } from './modules/model/model.module';
import { DiscountCodeModule } from './modules/discountCode/discount-code.module';
import { MaterialCategoryModule } from './modules/materialCategy/material-category.module';
import { DesignModelModule } from './modules/design-models/design-models.module';
import { DesignModule } from './modules/design/design/design.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    // ServeStaticModule.forRoot({
    // rootPath: join(__dirname, '..', 'uploads'),
    // }),
    AuthModule,
    UserModule,
    GovernorateModule,
    DistrictModule,
    MaterialModule,
    AppointmentsModule,
    MaterialModule,
    ItemModule,
    MeasurmentModule,
    OrderModule,
    OrderItemModule,
    BlockDatesModule,
    UserGroupsModule,
    CustomersModule,
    DesignersModule,
    SupplierModule,
    ModelModule,
    DiscountCodeModule,
    MaterialCategoryModule,
    DesignModelModule,
    DesignModule,
    QuotationModule,
  ],
})
export class AppModule {}