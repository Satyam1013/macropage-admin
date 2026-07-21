import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { BillingPlanKey } from './user.schema';

/** Mirrors `Subscription` from macropage-connect (collection: "subscriptions"). Read-only. */
export type ExternalSubscriptionDocument = HydratedDocument<ExternalSubscription>;

export type SubStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'PAUSED';

@Schema({ collection: 'subscriptions', strict: false })
export class ExternalSubscription {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: String, default: 'TRIAL' })
  plan: BillingPlanKey;

  @Prop({ type: String, default: 'TRIALING' })
  status: SubStatus;

  @Prop()
  billingCycle?: string;

  @Prop()
  trialEndsAt?: Date;

  @Prop()
  currentPeriodStart?: Date;

  @Prop()
  currentPeriodEnd?: Date;

  @Prop({ default: false })
  cancelAtPeriodEnd: boolean;

  @Prop()
  cancelledAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExternalSubscriptionSchema = SchemaFactory.createForClass(
  ExternalSubscription,
);
