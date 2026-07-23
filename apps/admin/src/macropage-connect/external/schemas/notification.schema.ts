import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Mirrors `Notification` from macropage-connect (collection: "notifications").
 * We WRITE here (admin broadcasts show up in the tenant's own in-app notification
 * feed), so this must match the real backend's shape exactly:
 * their `findAll` query is `{ tenantId, userId }`, both required to be visible.
 */
export type ExternalNotificationDocument = HydratedDocument<ExternalNotification>;

@Schema({
  collection: 'notifications',
  strict: false,
  timestamps: { createdAt: true, updatedAt: false },
})
export class ExternalNotification {
  @Prop({ required: true })
  tenantId: string;

  @Prop()
  userId?: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: Object })
  data?: Record<string, unknown>;

  @Prop({ default: false })
  isRead: boolean;

  createdAt?: Date;
}

export const ExternalNotificationSchema = SchemaFactory.createForClass(
  ExternalNotification,
);
