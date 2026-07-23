import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AdminBroadcast,
  AdminBroadcastDocument,
  BroadcastChannel,
} from './schemas/admin-broadcast.schema';
import {
  ExternalUser,
  ExternalUserDocument,
} from '../external/schemas/user.schema';
import {
  ExternalNotification,
  ExternalNotificationDocument,
} from '../external/schemas/notification.schema';
import { WhatsappTwilioProvider } from './providers/whatsapp-twilio.provider';
import { TagsService } from '../tags/tags.service';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

interface DispatchParams {
  title: string;
  body: string;
  channel: BroadcastChannel;
  targetType: 'all' | 'tag' | 'customer';
  targetIds: string[];
  customers: ExternalUserDocument[];
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(AdminBroadcast.name)
    private readonly broadcastModel: Model<AdminBroadcastDocument>,
    @InjectModel(ExternalUser.name)
    private readonly userModel: Model<ExternalUserDocument>,
    @InjectModel(ExternalNotification.name)
    private readonly notificationModel: Model<ExternalNotificationDocument>,
    private readonly whatsappProvider: WhatsappTwilioProvider,
    private readonly tagsService: TagsService,
  ) {}

  private async dispatch(params: DispatchParams) {
    const { title, body, channel, targetType, targetIds, customers } = params;

    const broadcast = await this.broadcastModel.create({
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
      let success: boolean;

      if (channel === 'in_app') {
        const tenantId = customer.tenantId ?? customer.id;
        await this.notificationModel.create({
          tenantId,
          userId: customer.id,
          type: 'admin_broadcast',
          title,
          body,
          data: { broadcastId: broadcast.id },
        });
        success = true;
      } else if (customer.phone) {
        const result = await this.whatsappProvider.send(customer.phone, body);
        success = result.success;
      } else {
        success = false;
      }

      if (success) sent += 1;
      else failed += 1;
    }

    broadcast.stats = { sent, failed };
    await broadcast.save();

    return broadcast;
  }

  async broadcastToAll(dto: BroadcastNotificationDto) {
    const customers = await this.userModel.find({ role: 'OWNER' }).exec();

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
    const customerIds =
      dto.targetType === 'tag'
        ? await this.tagsService.getCustomerIdsForTags(dto.targetIds)
        : dto.targetIds;

    const customers = await this.userModel
      .find({ _id: { $in: customerIds }, role: 'OWNER' })
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
    return this.broadcastModel.find().sort({ sentAt: -1 }).exec();
  }
}
