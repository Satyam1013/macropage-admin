import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateCategory = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
export type TemplateHeaderFormat = 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';

export class TemplateHeader {
  @Prop({ required: true, enum: ['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'] })
  format!: TemplateHeaderFormat;

  @Prop()
  text?: string;
}

export class TemplateButton {
  @Prop({ required: true })
  type!: string;

  @Prop({ required: true })
  text!: string;
}

export class TemplateButtons {
  @Prop({ type: [TemplateButton], default: [] })
  buttons!: TemplateButton[];
}

export type NotificationTemplateDocument =
  HydratedDocument<NotificationTemplate>;

/**
 * Admin-authored sample/starter templates. Deliberately a distinct
 * collection ("sampletemplates") — the real backend's "templates"
 * collection holds Meta-approved WhatsApp Business templates, an unrelated
 * live-data concept this app must not touch. Admin creates these here;
 * the real product reads from this same collection to show tenants
 * starter examples. Shape mirrors the real WhatsApp Business template
 * format (category/language/header/body/footer/buttons/sampleVariables)
 * minus per-tenant submission bookkeeping (tenantId, metaTemplateId,
 * status, usedInCampaigns) — samples aren't owned by a tenant and are
 * never submitted to Meta.
 */
@Schema({ timestamps: true, collection: 'sampletemplates' })
export class NotificationTemplate {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, enum: ['MARKETING', 'UTILITY', 'AUTHENTICATION'] })
  category!: TemplateCategory;

  @Prop({ required: true, default: 'en_US' })
  language!: string;

  @Prop({ type: TemplateHeader })
  header?: TemplateHeader;

  @Prop({ required: true })
  body!: string;

  @Prop()
  footer?: string;

  @Prop({ type: TemplateButtons })
  buttons?: TemplateButtons;

  @Prop({ type: Object, default: {} })
  sampleVariables!: Record<string, string>;

  @Prop({ type: Object, default: {} })
  variableTypes!: Record<string, string>;

  @Prop({ default: true })
  isActive!: boolean;
}

export const NotificationTemplateSchema =
  SchemaFactory.createForClass(NotificationTemplate);
