import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { CustomersController } from './customer.controller';
import { CustomersService } from './customer.service';
import { User } from 'src/modules/user/schemas/user.schema';
import { UserGroupsSchema } from 'src/modules/userGroups/user-groups/schemas/user-groups.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: Customer.name, schema: CustomerSchema },
        { name: User.name, schema: UserGroupsSchema },
      ]),
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
    exports: [CustomersService],
  })
  export class CustomersModule {}
