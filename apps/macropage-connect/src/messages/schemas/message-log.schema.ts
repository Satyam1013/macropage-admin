import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageChannel = 'whatsapp' | 'sms';
export type MessageStatus = 'sent' | 'failed';

export type MessageLogDocument = HydratedDocument<MessageLog>;

@Schema({ timestamps: true })
export class MessageLog {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ required: true, enum: ['whatsapp', 'sms'] })
  channel: MessageChannel;

  @Prop({ type: Types.ObjectId, ref: 'Template' })
  templateId?: Types.ObjectId;

  @Prop({ required: true, enum: ['sent', 'failed'] })
  status: MessageStatus;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop()
  errorReason?: string;
}

export const MessageLogSchema = SchemaFactory.createForClass(MessageLog);
