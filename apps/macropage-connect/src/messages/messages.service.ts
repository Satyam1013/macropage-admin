import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import {
  ExternalMessage,
  ExternalMessageDocument,
} from '../external/schemas/message.schema';
import { QueryMessageLogsDto } from './dto/query-message-logs.dto';
import { QueryMessageStatsDto } from './dto/query-message-stats.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(ExternalMessage.name)
    private readonly messageModel: Model<ExternalMessageDocument>,
  ) {}

  /** "customerId" here is the tenant's own user id (== tenantId in the real backend). */
  findLogs(query: QueryMessageLogsDto) {
    const { page = 1, limit = 20, customerId, status, from, to } = query;

    const filter: QueryFilter<ExternalMessageDocument> = {
      direction: 'OUTBOUND',
    };
    if (customerId) filter.tenantId = customerId;
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    return paginate(this.messageModel, filter, page, limit, {
      createdAt: -1,
    });
  }

  async getStats(query: QueryMessageStatsDto) {
    const { customerId, groupBy = 'day', from, to } = query;

    const match: QueryFilter<ExternalMessageDocument> = {
      direction: 'OUTBOUND',
    };
    if (customerId) match.tenantId = customerId;
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const results = await this.messageModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' },
          },
          total: { $sum: 1 },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period: r._id as string,
      sent: (r.total as number) - (r.failed as number),
      failed: r.failed as number,
      total: r.total as number,
    }));
  }

  async getStatsForCustomer(tenantId: string) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const base = { tenantId, direction: 'OUTBOUND' as const };

    const [today, thisMonth, total, failedTotal] = await Promise.all([
      this.messageModel.countDocuments({
        ...base,
        createdAt: { $gte: startOfToday },
      }),
      this.messageModel.countDocuments({
        ...base,
        createdAt: { $gte: startOfMonth },
      }),
      this.messageModel.countDocuments(base),
      this.messageModel.countDocuments({ ...base, status: 'FAILED' }),
    ]);

    return { today, thisMonth, total, failedTotal };
  }

  async getTodayGlobalStats() {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const base = {
      direction: 'OUTBOUND' as const,
      createdAt: { $gte: startOfToday },
    };

    const [total, failedToday] = await Promise.all([
      this.messageModel.countDocuments(base),
      this.messageModel.countDocuments({ ...base, status: 'FAILED' }),
    ]);

    return { sentToday: total - failedToday, failedToday };
  }
}
