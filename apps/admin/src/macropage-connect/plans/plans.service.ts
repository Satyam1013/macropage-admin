import { Injectable, NotFoundException } from '@nestjs/common';
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
import {
  PlanOverride,
  PlanOverrideDocument,
} from './schemas/plan-override.schema';
import { UpdatePlanDto } from './dto/update-plan.dto';

function mergePlan(
  current: Record<string, unknown>,
  changes: Record<string, unknown>,
): Record<string, unknown> {
  return Object.entries(changes).reduce<Record<string, unknown>>(
    (result, [key, value]) => {
      const existing = result[key];
      result[key] =
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        existing &&
        typeof existing === 'object' &&
        !Array.isArray(existing)
          ? mergePlan(
              existing as Record<string, unknown>,
              value as Record<string, unknown>,
            )
          : value;
      return result;
    },
    { ...current },
  );
}

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(ExternalSubscription.name)
    private readonly subscriptionModel: Model<ExternalSubscriptionDocument>,
    @InjectModel(ExternalPayment.name)
    private readonly paymentModel: Model<ExternalPaymentDocument>,
    @InjectModel(PlanOverride.name)
    private readonly planOverrideModel: Model<PlanOverrideDocument>,
  ) {}

  async getCatalog() {
    const overrides = await this.planOverrideModel.find().lean().exec();
    const overridesByPlanId = new Map(
      overrides.map((override) => [override.planId, override.plan]),
    );

    return listPlans().map((plan) =>
      mergePlan(plan, overridesByPlanId.get(plan.id) ?? {}),
    );
  }

  async update(planId: string, dto: UpdatePlanDto) {
    const defaultPlan = listPlans().find((plan) => plan.id === planId);
    if (!defaultPlan) {
      throw new NotFoundException('Plan not found');
    }

    const existingOverride = await this.planOverrideModel
      .findOne({ planId })
      .lean()
      .exec();
    const plan = mergePlan(
      existingOverride?.plan ?? defaultPlan,
      dto as Record<string, unknown>,
    );

    const updatedOverride = await this.planOverrideModel
      .findOneAndUpdate(
        { planId },
        { $set: { plan } },
        { new: true, upsert: true, runValidators: true },
      )
      .lean()
      .exec();

    return updatedOverride.plan;
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
