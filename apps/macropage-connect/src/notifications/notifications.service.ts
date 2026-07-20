import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationChannel,
} from './schemas/notification.schema';
import {
  Customer,
  CustomerDocument,
} from '../customers/schemas/customer.schema';
import { WhatsappTwilioProvider } from './providers/whatsapp-twilio.provider';
import { MessagesService } from '../messages/messages.service';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

interface DispatchParams {
  title: string;
  body: string;
  channel: NotificationChannel;
  targetType: 'all' | 'tag' | 'customer';
  targetIds: string[];
  customers: CustomerDocument[];
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly whatsappProvider: WhatsappTwilioProvider,
    private readonly messagesService: MessagesService,
  ) {}

  private async dispatch(params: DispatchParams) {
    const { title, body, channel, targetType, targetIds, customers } = params;

    const notification = await this.notificationModel.create({
      title,
      body,
      channel,
      targetType,
      targetIds,
      sentAt: new Date(),
      stats: { sent: 0, failed: 0 },
    });

    let sent = 0;
    let failed = 0;

    for (const customer of customers) {
      const result =
        channel === 'whatsapp'
          ? await this.whatsappProvider.send(customer.phone, body)
          : { success: false, error: 'SMS provider not configured' };

      if (result.success) {
        sent += 1;
      } else {
        failed += 1;
      }

      await this.messagesService.logMessage({
        customerId: customer._id,
        channel,
        status: result.success ? 'sent' : 'failed',
        errorReason: result.error,
      });
    }

    notification.stats = { sent, failed };
    await notification.save();

    return notification;
  }

  async broadcastToAll(dto: BroadcastNotificationDto) {
    const customers = await this.customerModel
      .find({ status: 'active' })
      .exec();

    return this.dispatch({
      title: dto.title,
      body: dto.body,
      channel: dto.channel,
      targetType: 'all',
      targetIds: [],
      customers,
    });
  }

  async sendToTargets(dto: SendNotificationDto) {
    const customers =
      dto.targetType === 'tag'
        ? await this.customerModel
            .find({ tagIds: { $in: dto.targetIds } })
            .exec()
        : await this.customerModel
            .find({ _id: { $in: dto.targetIds } })
            .exec();

    return this.dispatch({
      title: dto.title,
      body: dto.body,
      channel: dto.channel,
      targetType: dto.targetType,
      targetIds: dto.targetIds,
      customers,
    });
  }

  findAll() {
    return this.notificationModel.find().sort({ sentAt: -1 }).exec();
  }
}
