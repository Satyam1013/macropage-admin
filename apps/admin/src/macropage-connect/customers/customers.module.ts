import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalUser, ExternalUserSchema } from '../external/schemas/user.schema';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PlansModule } from '../plans/plans.module';
import { MessagesModule } from '../messages/messages.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalUser.name, schema: ExternalUserSchema },
    ]),
    PlansModule,
    MessagesModule,
    TagsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, MongooseModule],
})
export class CustomersModule {}
