import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalUser, ExternalUserSchema } from '../external/schemas/user.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionSchema,
} from '../external/schemas/subscription.schema';
import { MessagesModule } from '../messages/messages.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalUser.name, schema: ExternalUserSchema },
      { name: ExternalSubscription.name, schema: ExternalSubscriptionSchema },
    ]),
    MessagesModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
