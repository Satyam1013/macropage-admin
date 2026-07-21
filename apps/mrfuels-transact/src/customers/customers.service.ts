import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import {
  ExternalAdmin,
  ExternalAdminDocument,
} from '../external/schemas/admin.schema';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { PlansService } from '../plans/plans.service';
import { TagsService } from '../tags/tags.service';

/** Never let the password hash from the real `admins` collection leak through this API. */
const SAFE_PROJECTION = '-password';

/**
 * A "customer" is a pump-owner subscriber: every doc in the real `admins`
 * collection is one (Manager/Staff accounts live in separate collections).
 * Read-only — accounts are created via the product's own signup flow.
 */
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(ExternalAdmin.name)
    private readonly adminModel: Model<ExternalAdminDocument>,
    private readonly plansService: PlansService,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(query: QueryCustomersDto) {
    const { page = 1, limit = 20, search, setupComplete, tagId } = query;

    const filter: QueryFilter<ExternalAdminDocument> = {};
    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { dealerCode: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { mobileNo: { $regex: search, $options: 'i' } },
      ];
    }
    if (setupComplete !== undefined) filter.setupComplete = setupComplete;
    if (tagId) {
      const customerIds = await this.tagsService.getCustomerIdsForTags([
        tagId,
      ]);
      filter._id = { $in: customerIds };
    }

    return paginate(
      this.adminModel,
      filter,
      page,
      limit,
      { createdAt: -1 },
      SAFE_PROJECTION,
    );
  }

  async findOne(id: string) {
    const customer = await this.adminModel
      .findById(id, SAFE_PROJECTION)
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async getProfile(id: string) {
    const customer = await this.findOne(id);

    const [currentPlan, planHistory, tags] = await Promise.all([
      this.plansService.getCurrentSubscription(id),
      this.plansService.getHistoryForAdmin(id),
      this.tagsService.findTagsForCustomer(id),
    ]);

    return { customer, currentPlan, planHistory, tags };
  }
}
