import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import type { TicketPriority, TicketStatus } from '../schemas/ticket.schema';

export class CreateTicketDto {
  @IsMongoId()
  customerId: string;

  @IsString()
  subject: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['open', 'pending', 'resolved', 'closed'])
  status?: TicketStatus;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: TicketPriority;

  @IsOptional()
  @IsMongoId()
  assignedTo?: string;
}
