import { IsEnum } from 'class-validator';
import type { TicketStatus } from '../schemas/ticket.schema';

export class UpdateTicketDto {
  @IsEnum(['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED'])
  status: TicketStatus;
}
