import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { WhatsappTwilioProvider } from './providers/whatsapp-twilio.provider';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
    MessagesModule,
    ConfigModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, WhatsappTwilioProvider],
  exports: [NotificationsService],
})
export class NotificationsModule {}
