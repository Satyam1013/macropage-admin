import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationTargetType = 'all' | 'tag' | 'customer';
export type NotificationChannel = 'whatsapp' | 'sms';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ required: true, enum: ['all', 'tag', 'customer'] })
  targetType: NotificationTargetType;

  @Prop({ type: [Types.ObjectId], default: [] })
  targetIds: Types.ObjectId[];

  @Prop({ required: true, enum: ['whatsapp', 'sms'] })
  channel: NotificationChannel;

  @Prop({ type: Types.ObjectId, ref: 'Template' })
  templateId?: Types.ObjectId;

  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({
    type: { sent: Number, failed: Number },
    default: { sent: 0, failed: 0 },
  })
  stats: { sent: number; failed: number };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
