import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateChannel = 'whatsapp' | 'sms' | 'push';

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;

/**
 * Admin-authored notification/message templates. Deliberately a distinct
 * collection ("notification_templates") — the real backend's "templates"
 * collection holds Meta-approved WhatsApp Business templates, an unrelated
 * live-data concept this app must not touch.
 */
@Schema({ timestamps: true, collection: 'notification_templates' })
export class NotificationTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ['whatsapp', 'sms', 'push'] })
  channel: TemplateChannel;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  variables: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const NotificationTemplateSchema =
  SchemaFactory.createForClass(NotificationTemplate);
