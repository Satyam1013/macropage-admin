import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import {
  ExternalUser,
  ExternalUserDocument,
} from '../external/schemas/user.schema';
import {
  ExternalContact,
  ExternalContactDocument,
} from '../external/schemas/contact.schema';
import {
  ExternalMessage,
  ExternalMessageDocument,
} from '../external/schemas/message.schema';
import { QueryCustomersDto } from './dto/query-customers.dto';
import { PlansService } from '../plans/plans.service';
import { MessagesService } from '../messages/messages.service';
import { TagsService } from '../tags/tags.service';

/** Never let auth secrets from the real `users` collection leak through this API. */
const SAFE_PROJECTION =
  '-password -twoFactorSecret -backupCodes -emailVerifyToken -emailVerifyExpires';

/** A "customer" is a tenant account: a `users` doc with role OWNER. Read-only — tenants are created via the product's own signup flow. */
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(ExternalUser.name)
    private readonly userModel: Model<ExternalUserDocument>,
    @InjectModel(ExternalContact.name)
    private readonly contactModel: Model<ExternalContactDocument>,
    @InjectModel(ExternalMessage.name)
    private readonly messageModel: Model<ExternalMessageDocument>,
    private readonly plansService: PlansService,
    private readonly messagesService: MessagesService,
    private readonly tagsService: TagsService,
  ) {}

  async findAll(query: QueryCustomersDto) {
    const { page = 1, limit = 20, search, billingPlan, tagId } = query;

    const filter: QueryFilter<ExternalUserDocument> = { role: 'OWNER' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (billingPlan) filter.billingPlan = billingPlan;
    if (tagId) {
      const customerIds = await this.tagsService.getCustomerIdsForTags([tagId]);
      filter._id = { $in: customerIds };
    }

    const result = await paginate(
      this.userModel,
      filter,
      page,
      limit,
      { createdAt: -1 },
      SAFE_PROJECTION,
    );

    const tenantIds = [
      ...new Set(
        result.items.map((customer) =>
          String(customer.tenantId ?? (customer as ExternalUserDocument)._id),
        ),
      ),
    ];

    if (tenantIds.length === 0) {
      return result;
    }

    const [messageCounts, contactCounts] = await Promise.all([
      this.messageModel.aggregate<{ _id: string; count: number }>([
        { $match: { tenantId: { $in: tenantIds } } },
        { $group: { _id: '$tenantId', count: { $sum: 1 } } },
      ]),
      this.contactModel.aggregate<{ _id: string; count: number }>([
        { $match: { tenantId: { $in: tenantIds } } },
        { $group: { _id: '$tenantId', count: { $sum: 1 } } },
      ]),
    ]);
    const messageCountsByTenant = new Map(
      messageCounts.map(({ _id, count }) => [String(_id), count]),
    );
    const contactCountsByTenant = new Map(
      contactCounts.map(({ _id, count }) => [String(_id), count]),
    );

    return {
      ...result,
      items: result.items.map((customer) => {
        const customerDocument = customer as ExternalUserDocument;
        const tenantId = String(customer.tenantId ?? customerDocument._id);
        return {
          ...customerDocument.toObject(),
          totalMessages: messageCountsByTenant.get(tenantId) ?? 0,
          totalContacts: contactCountsByTenant.get(tenantId) ?? 0,
        };
      }),
    };
  }

  async findOne(id: string) {
    const customer = await this.userModel
      .findOne({ _id: id, role: 'OWNER' }, SAFE_PROJECTION)
      .exec();
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async getProfile(id: string) {
    const customer = await this.findOne(id);
    const tenantId = customer.tenantId ?? customer.id;

    const [currentPlan, planHistory, messageStats, tags] = await Promise.all([
      this.plansService.getCurrentSubscription(tenantId),
      this.plansService.getPaymentHistory(tenantId),
      this.messagesService.getStatsForCustomer(tenantId),
      this.tagsService.findTagsForCustomer(id),
    ]);

    return {
      customer,
      currentPlan,
      planHistory,
      messageStats,
      tags,
    };
  }
}
