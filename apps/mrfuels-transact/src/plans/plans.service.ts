import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import {
  ExternalSubscription,
  ExternalSubscriptionDocument,
} from '../external/schemas/subscription.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
    @InjectModel(ExternalSubscription.name)
    private readonly subscriptionModel: Model<ExternalSubscriptionDocument>,
  ) {}

  create(dto: CreatePlanDto) {
    return this.planModel.create(dto);
  }

  findAll() {
    return this.planModel.find().sort({ tier: 1 }).exec();
  }

  async findOne(id: string) {
    const plan = await this.planModel.findById(id).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async update(id: string, dto: UpdatePlanDto) {
    const plan = await this.planModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async remove(id: string) {
    const plan = await this.planModel.findByIdAndDelete(id).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  /** Each Subscription doc is one plan-selection event (see real AdminService.selectPlan) — this IS the purchase/renewal log. */
  getHistoryForAdmin(adminId: string) {
    return this.subscriptionModel
      .find({ adminId })
      .sort({ startDate: -1 })
      .lean()
      .exec();
  }

  getCurrentSubscription(adminId: string) {
    return this.subscriptionModel
      .findOne({ adminId, status: 'active' })
      .sort({ startDate: -1 })
      .lean()
      .exec();
  }

  countActiveSubscriptions() {
    return this.subscriptionModel.countDocuments({ status: 'active' }).exec();
  }
}
