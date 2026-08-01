import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TicketStatus =
  'OPEN' | 'IN_PROGRESS' | 'PENDING' | 'RESOLVED' | 'CLOSED';
export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketDocument = HydratedDocument<Ticket>;

/** Mirrors tickets created by the customer-facing Help module. */
@Schema({ timestamps: true, collection: 'tickets' })
export class Ticket {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, trim: true })
  userName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  userEmail: string;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: ['OPEN', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED'],
    default: 'OPEN',
  })
  status: TicketStatus;

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: TicketPriority;

  @Prop({ type: [String], default: [] })
  attachments: string[];
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
