import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalAdmin, ExternalAdminSchema } from '../external/schemas/admin.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionSchema,
} from '../external/schemas/subscription.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: ExternalAdmin.name, schema: ExternalAdminSchema },
        { name: ExternalSubscription.name, schema: ExternalSubscriptionSchema },
      ],
      'mrFuels',
    ),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
