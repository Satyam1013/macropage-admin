import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import {
  CustomerPlan,
  CustomerPlanSchema,
} from '../plans/schemas/customer-plan.schema';
import { MessagesModule } from '../messages/messages.module';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: CustomerPlan.name, schema: CustomerPlanSchema },
    ]),
    MessagesModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
