import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';
import { UserGroups, UserGroupsSchema } from './schemas/user-groups.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserGroups.name, schema: UserGroupsSchema }])],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService]
})
export class UserGroupsModule {}
