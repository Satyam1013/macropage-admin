import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QueryFilter, Model } from 'mongoose';
import { paginate } from '@app/common';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketsDto } from './dto/query-tickets.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name, 'mrFuels')
    private readonly ticketModel: Model<TicketDocument>,
  ) {}

  create(dto: CreateTicketDto) {
    return this.ticketModel.create(dto);
  }

  findAll(query: QueryTicketsDto) {
    const { page = 1, limit = 20, status, priority, customerId, assignedTo } =
      query;

    const filter: QueryFilter<TicketDocument> = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (customerId) filter.customerId = customerId;
    if (assignedTo) filter.assignedTo = assignedTo;

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
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }

  async remove(id: string) {
    const ticket = await this.ticketModel.findByIdAndDelete(id).exec();
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    return ticket;
  }
}
