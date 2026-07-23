import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PlansModule } from './plans/plans.module';
import { TagsModule } from './tags/tags.module';
import { AdsModule } from './ads/ads.module';
import { StatsModule } from './stats/stats.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    CustomersModule,
    PlansModule,
    TagsModule,
    AdsModule,
    StatsModule,
    SupportModule,
  ],
})
export class MrFuelsModule {}
