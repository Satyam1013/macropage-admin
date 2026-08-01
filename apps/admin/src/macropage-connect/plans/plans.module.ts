import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExternalSubscription,
  ExternalSubscriptionSchema,
} from '../external/schemas/subscription.schema';
import {
  ExternalPayment,
  ExternalPaymentSchema,
} from '../external/schemas/payment.schema';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import {
  PlanOverride,
  PlanOverrideSchema,
} from './schemas/plan-override.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalSubscription.name, schema: ExternalSubscriptionSchema },
      { name: ExternalPayment.name, schema: ExternalPaymentSchema },
      { name: PlanOverride.name, schema: PlanOverrideSchema },
    ]),
  ],
  controllers: [PlansController],
  providers: [PlansService],
  exports: [PlansService, MongooseModule],
})
export class PlansModule {}
