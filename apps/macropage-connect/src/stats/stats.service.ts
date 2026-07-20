import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from '../customers/schemas/customer.schema';
import {
  CustomerPlan,
  CustomerPlanDocument,
} from '../plans/schemas/customer-plan.schema';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(CustomerPlan.name)
    private readonly customerPlanModel: Model<CustomerPlanDocument>,
    private readonly messagesService: MessagesService,
  ) {}

  async getDashboard() {
    const [totalCustomers, enrolledCustomerIds, globalStats] =
      await Promise.all([
        this.customerModel.countDocuments(),
        this.customerPlanModel.distinct('customerId', { status: 'active' }),
        this.messagesService.getTodayGlobalStats(),
      ]);

    return {
      totalCustomers,
      totalEnrolledCustomers: enrolledCustomerIds.length,
      messagesSentToday: globalStats.sentToday,
      messagesFailedToday: globalStats.failedToday,
    };
  }
}
