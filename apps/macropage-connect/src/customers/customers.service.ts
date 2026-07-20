import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { PlansService } from '../plans/plans.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly plansService: PlansService,
    private readonly messagesService: MessagesService,
  ) {}

  create(dto: CreateCustomerDto) {
    return this.customerModel.create(dto);
  }

  findAll(query: QueryCustomersDto) {
    const { page = 1, limit = 20, search, status, tagId } = query;

    const filter: QueryFilter<CustomerDocument> = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) filter.status = status;
    if (tagId) filter.tagIds = tagId;

    return paginate(this.customerModel, filter, page, limit);
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.customerModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async remove(id: string) {
    const customer = await this.customerModel.findByIdAndDelete(id).exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async getProfile(id: string) {
    const customer = await this.findOne(id);

    const [planHistory, messageStats] = await Promise.all([
      this.plansService.getHistoryForCustomer(id),
      this.messagesService.getStatsForCustomer(id),
    ]);

    const currentPlan =
      planHistory.find((p) => p.status === 'active') ??
      planHistory[0] ??
      null;

    return {
      customer,
      currentPlan,
      planHistory,
      messageStats,
    };
  }
}
