import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateChannel = 'whatsapp' | 'sms' | 'push';
export type TemplateCategory = 'marketing' | 'utility' | 'authentication';

export type NotificationTemplateDocument = HydratedDocument<NotificationTemplate>;

/**
 * Admin-authored sample/starter templates. Deliberately a distinct
 * collection ("sampletemplates") — the real backend's "templates"
 * collection holds Meta-approved WhatsApp Business templates, an unrelated
 * live-data concept this app must not touch. Admin creates these here;
 * the real product reads from this same collection to show tenants
 * starter examples.
 */
@Schema({ timestamps: true, collection: 'sampletemplates' })
export class NotificationTemplate {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ['whatsapp', 'sms', 'push'] })
  channel: TemplateChannel;

  @Prop({
    required: true,
    enum: ['marketing', 'utility', 'authentication'],
  })
  category: TemplateCategory;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  variables: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const NotificationTemplateSchema =
  SchemaFactory.createForClass(NotificationTemplate);
