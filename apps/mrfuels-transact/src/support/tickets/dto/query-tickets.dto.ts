import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '@app/common';
import type { TicketPriority, TicketStatus } from '../schemas/ticket.schema';

export class QueryTicketsDto extends PaginationDto {
  @IsOptional()
  @IsEnum(['open', 'pending', 'resolved', 'closed'])
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TicketPriority;

  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}
