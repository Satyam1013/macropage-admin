import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PlansModule } from './plans/plans.module';
import { MessagesModule } from './messages/messages.module';
import { TagsModule } from './tags/tags.module';
import { TemplatesModule } from './templates/templates.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdsModule } from './ads/ads.module';
import { StatsModule } from './stats/stats.module';
import { SupportModule } from './support/support.module';
import { HelpModule } from './help/help.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    CustomersModule,
    PlansModule,
    MessagesModule,
    TagsModule,
    TemplatesModule,
    NotificationsModule,
    AdsModule,
    StatsModule,
    SupportModule,
    HelpModule,
    UploadModule,
  ],
})
export class MacropageConnectModule {}
