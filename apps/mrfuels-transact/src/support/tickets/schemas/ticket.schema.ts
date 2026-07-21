import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema({ timestamps: true })
export class Ticket {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  subject: string;

  @Prop()
  description?: string;

  @Prop({
    required: true,
    enum: ['open', 'pending', 'resolved', 'closed'],
    default: 'open',
  })
  status: TicketStatus;

  @Prop({
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: TicketPriority;

  @Prop({ type: Types.ObjectId, ref: 'AdminUser' })
  assignedTo?: Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
