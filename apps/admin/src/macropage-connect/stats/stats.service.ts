import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExternalUser,
  ExternalUserDocument,
} from '../external/schemas/user.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionDocument,
} from '../external/schemas/subscription.schema';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(ExternalUser.name)
    private readonly userModel: Model<ExternalUserDocument>,
    @InjectModel(ExternalSubscription.name)
    private readonly subscriptionModel: Model<ExternalSubscriptionDocument>,
    private readonly messagesService: MessagesService,
  ) {}

  async getDashboard() {
    const [totalCustomers, totalEnrolledCustomers, globalStats] =
      await Promise.all([
        this.userModel.countDocuments({ role: 'OWNER' }),
        this.subscriptionModel.countDocuments({ status: 'ACTIVE' }),
        this.messagesService.getTodayGlobalStats(),
      ]);

    return {
      totalCustomers,
      totalEnrolledCustomers,
      messagesSentToday: globalStats.sentToday,
      messagesFailedToday: globalStats.failedToday,
    };
  }
}
