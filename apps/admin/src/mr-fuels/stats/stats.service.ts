import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExternalAdmin,
  ExternalAdminDocument,
} from '../external/schemas/admin.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionDocument,
} from '../external/schemas/subscription.schema';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(ExternalAdmin.name, 'mrFuels')
    private readonly adminModel: Model<ExternalAdminDocument>,
    @InjectModel(ExternalSubscription.name, 'mrFuels')
    private readonly subscriptionModel: Model<ExternalSubscriptionDocument>,
  ) {}

  async getDashboard() {
    const [totalCustomers, totalEnrolledCustomers] = await Promise.all([
      this.adminModel.countDocuments(),
      this.subscriptionModel.countDocuments({ status: 'active' }),
    ]);

    return { totalCustomers, totalEnrolledCustomers };
  }
}
