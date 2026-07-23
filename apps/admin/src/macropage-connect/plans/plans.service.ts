import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ExternalSubscription,
  ExternalSubscriptionDocument,
} from '../external/schemas/subscription.schema';
import {
  ExternalPayment,
  ExternalPaymentDocument,
} from '../external/schemas/payment.schema';
import { listPlans } from './plans.catalog';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(ExternalSubscription.name)
    private readonly subscriptionModel: Model<ExternalSubscriptionDocument>,
    @InjectModel(ExternalPayment.name)
    private readonly paymentModel: Model<ExternalPaymentDocument>,
  ) {}

  getCatalog() {
    return listPlans();
  }

  getCurrentSubscription(tenantId: string) {
    return this.subscriptionModel.findOne({ tenantId }).lean().exec();
  }

  /** Each Payment doc is one purchase/renewal event — this IS the plan history log. */
  getPaymentHistory(tenantId: string) {
    return this.paymentModel
      .find({ tenantId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  countActiveSubscriptions() {
    return this.subscriptionModel.countDocuments({ status: 'ACTIVE' }).exec();
  }
}
