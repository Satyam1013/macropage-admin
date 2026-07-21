import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Mirrors `Subscription` from mr-fuels (collection: "subscriptions"). Read-only.
 * A new doc is created every time an admin selects a plan (see the real
 * `AdminService.selectPlan`), so this collection IS the plan purchase/renewal
 * history — no separate payment-gateway log exists yet in the real backend.
 * NOTE: `adminId`/`planId` are stored as plain strings in the real data
 * (not BSON ObjectId) despite the real Mongoose schema declaring
 * `Types.ObjectId` — must stay `String` here or queries silently match nothing.
 */
export type ExternalSubscriptionDocument = HydratedDocument<ExternalSubscription>;

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

@Schema({ collection: 'subscriptions', strict: false })
export class ExternalSubscription {
  @Prop({ required: true })
  adminId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ type: String, default: 'active' })
  status: SubscriptionStatus;

  @Prop({ default: false })
  isTrial: boolean;

  @Prop()
  paymentId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExternalSubscriptionSchema = SchemaFactory.createForClass(
  ExternalSubscription,
);
