import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Plan, PlanDocument } from './schemas/plan.schema';
import {
  CustomerPlan,
  CustomerPlanDocument,
} from './schemas/customer-plan.schema';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PurchasePlanDto } from './dto/purchase-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<PlanDocument>,
    @InjectModel(CustomerPlan.name)
    private readonly customerPlanModel: Model<CustomerPlanDocument>,
  ) {}

  create(dto: CreatePlanDto) {
    return this.planModel.create(dto);
  }

  findAll() {
    return this.planModel.find().exec();
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

  async purchaseOrRenew(dto: PurchasePlanDto) {
    const plan = await this.planModel.findById(dto.planId).exec();
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const existingActive = await this.customerPlanModel
      .findOne({
        customerId: dto.customerId,
        planId: dto.planId,
        status: 'active',
      })
      .exec();

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
    );

    return this.customerPlanModel.create({
      customerId: dto.customerId,
      planId: dto.planId,
      purchasedAt: now,
      renewedAt: existingActive ? now : undefined,
      expiresAt,
      amount: plan.price,
      status: 'active',
    });
  }

  getHistoryForCustomer(customerId: string) {
    return this.customerPlanModel
      .find({ customerId })
      .sort({ purchasedAt: -1 })
      .populate('planId')
      .exec();
  }
}
