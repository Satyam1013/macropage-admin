import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Plan, PlanSchema } from './schemas/plan.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionSchema,
} from '../external/schemas/subscription.schema';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Plan.name, schema: PlanSchema },
      { name: ExternalSubscription.name, schema: ExternalSubscriptionSchema },
    ]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService, MongooseModule],
})
export class PlansModule {}
