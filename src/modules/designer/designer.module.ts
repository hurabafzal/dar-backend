import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DesignersController } from './designer.controller';
import { DesignersService } from './designer.service';
import { User, UserSchema } from 'src/modules/user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [DesignersController],
  providers: [DesignersService],
})
export class DesignersModule {}

