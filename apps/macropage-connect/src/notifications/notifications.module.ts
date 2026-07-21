import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AdminBroadcast,
  AdminBroadcastSchema,
} from './schemas/admin-broadcast.schema';
import { ExternalUser, ExternalUserSchema } from '../external/schemas/user.schema';
import {
  ExternalNotification,
  ExternalNotificationSchema,
} from '../external/schemas/notification.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { WhatsappTwilioProvider } from './providers/whatsapp-twilio.provider';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminBroadcast.name, schema: AdminBroadcastSchema },
      { name: ExternalUser.name, schema: ExternalUserSchema },
      { name: ExternalNotification.name, schema: ExternalNotificationSchema },
    ]),
    TagsModule,
    ConfigModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsappTwilioProvider],
  exports: [NotificationsService],
})
export class NotificationsModule {}
