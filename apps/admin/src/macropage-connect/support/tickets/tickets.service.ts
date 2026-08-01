import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketsDto } from './dto/query-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  findAll(query: QueryTicketsDto) {
    const { page = 1, limit = 20, status, priority, tenantId } = query;

    const filter: QueryFilter<TicketDocument> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (tenantId) filter.tenantId = tenantId;

    return paginate(this.ticketModel, filter, page, limit);
  }

  async findOne(id: string) {
    const ticket = await this.ticketModel.findById(id).exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async update(id: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketModel
      .findByIdAndUpdate(
        id,
        { $set: { status: dto.status } },
        { new: true, runValidators: true },
      )
      .exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }
}
