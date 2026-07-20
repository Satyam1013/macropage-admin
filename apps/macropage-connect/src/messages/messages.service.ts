import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model, Types } from 'mongoose';
import { paginate } from '@app/common';
import {
  MessageLog,
  MessageLogDocument,
  MessageChannel,
  MessageStatus,
} from './schemas/message-log.schema';
import { QueryMessageLogsDto } from './dto/query-message-logs.dto';
import { QueryMessageStatsDto } from './dto/query-message-stats.dto';

export interface LogMessageInput {
  customerId: string | Types.ObjectId;
  channel: MessageChannel;
  templateId?: string | Types.ObjectId;
  status: MessageStatus;
  errorReason?: string;
}

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(MessageLog.name)
    private readonly messageLogModel: Model<MessageLogDocument>,
  ) {}

  logMessage(input: LogMessageInput) {
    return this.messageLogModel.create({
      customerId: input.customerId,
      channel: input.channel,
      templateId: input.templateId,
      status: input.status,
      errorReason: input.errorReason,
      sentAt: new Date(),
    });
  }

  findLogs(query: QueryMessageLogsDto) {
    const { page = 1, limit = 20, customerId, channel, status, from, to } =
      query;

    const filter: QueryFilter<MessageLogDocument> = {};
    if (customerId) filter.customerId = customerId;
    if (channel) filter.channel = channel;
    if (status) filter.status = status;
    if (from || to) {
      filter.sentAt = {};
      if (from) filter.sentAt.$gte = new Date(from);
      if (to) filter.sentAt.$lte = new Date(to);
    }

    return paginate(this.messageLogModel, filter, page, limit, {
      sentAt: -1,
    });
  }

  async getStats(query: QueryMessageStatsDto) {
    const { customerId, groupBy = 'day', from, to } = query;

    const match: QueryFilter<MessageLogDocument> = {};
    if (customerId) match.customerId = new Types.ObjectId(customerId);
    if (from || to) {
      match.sentAt = {};
      if (from) match.sentAt.$gte = new Date(from);
      if (to) match.sentAt.$lte = new Date(to);
    }

    const dateFormat = groupBy === 'month' ? '%Y-%m' : '%Y-%m-%d';

    const results = await this.messageLogModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$sentAt' },
          },
          total: { $sum: 1 },
          sent: {
            $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] },
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return results.map((r) => ({
      period: r._id as string,
      sent: r.sent as number,
      failed: r.failed as number,
      total: r.total as number,
    }));
  }

  async getStatsForCustomer(customerId: string) {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [today, thisMonth, total, failedTotal] = await Promise.all([
      this.messageLogModel.countDocuments({
        customerId,
        sentAt: { $gte: startOfToday },
      }),
      this.messageLogModel.countDocuments({
        customerId,
        sentAt: { $gte: startOfMonth },
      }),
      this.messageLogModel.countDocuments({ customerId }),
      this.messageLogModel.countDocuments({ customerId, status: 'failed' }),
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

    const [sentToday, failedToday] = await Promise.all([
      this.messageLogModel.countDocuments({
        sentAt: { $gte: startOfToday },
        status: 'sent',
      }),
      this.messageLogModel.countDocuments({
        sentAt: { $gte: startOfToday },
        status: 'failed',
      }),
    ]);

    return { sentToday, failedToday };
  }
}
