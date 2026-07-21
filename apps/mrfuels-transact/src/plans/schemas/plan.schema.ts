import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanName = 'pro' | 'premium';
export type PlanStatus = 'active' | 'inactive';
export type DurationType = 'trial' | 'monthly' | 'yearly';
export type Currency = 'INR';

export type PlanDocument = HydratedDocument<Plan>;

/**
 * Mirrors the real mr-fuels `Plan` schema exactly (collection: "plans") —
 * this app has full CRUD here, unlike the read-only external mirrors,
 * because mr-fuels' plan catalog genuinely lives in this DB with no
 * separate hardcoded config (unlike macropage-connect's plan catalog).
 */
@Schema({ timestamps: true, collection: 'plans' })
export class Plan {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, type: String, enum: ['pro', 'premium'] })
  name: PlanName;

  @Prop({ required: true })
  tier: number;

  @Prop({ required: true })
  description: string;

  @Prop({
    _id: false,
    type: {
      durationType: { type: String, enum: ['trial', 'monthly', 'yearly'], required: true },
      months: { type: Number, required: true },
    },
  })
  duration: { durationType: DurationType; months: number };

  @Prop({
    _id: false,
    type: {
      originalPrice: { type: Number, required: true },
      finalPrice: { type: Number, required: true },
      currency: { type: String, enum: ['INR'], required: true },
      isFree: { type: Boolean, required: true },
    },
  })
  pricing: {
    originalPrice: number;
    finalPrice: number;
    currency: Currency;
    isFree: boolean;
  };

  @Prop({
    _id: false,
    type: {
      enabled: { type: Boolean, required: true },
      trialDays: { type: Number },
    },
  })
  trial: { enabled: boolean; trialDays?: number };

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({
    _id: false,
    type: { mostPopular: Boolean, discounted: Boolean, freeTrial: Boolean },
    default: {},
  })
  tags?: { mostPopular?: boolean; discounted?: boolean; freeTrial?: boolean };

  @Prop({
    _id: false,
    type: { badgeText: String, badgeColor: String, gradient: [String] },
    default: {},
  })
  ui?: { badgeText?: string; badgeColor?: string; gradient?: string[] };

  @Prop({ type: String, default: 'active' })
  status: PlanStatus;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
