import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Mirrors `User` from the macropage-connect backend (collection: "users").
 * This app never writes here — a tenant "customer" is a user with role OWNER.
 * Schema is intentionally partial + `strict: false`; always read via `.lean()`
 * so unmapped real-backend fields still come through untouched.
 */
export type ExternalUserDocument = HydratedDocument<ExternalUser>;

export type UserRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'AGENT';
export type BillingPlanKey =
  | 'TRIAL'
  | 'STARTER'
  | 'GROWTH'
  | 'BUSINESS'
  | 'ENTERPRISE';

@Schema({ collection: 'users', strict: false })
export class ExternalUser {
  @Prop()
  tenantId?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop()
  company?: string;

  @Prop({ type: String, required: true })
  role: UserRole;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ default: false })
  whatsappSetupDone: boolean;

  @Prop({ default: false })
  onboardingComplete: boolean;

  @Prop({ type: String })
  billingPlan?: BillingPlanKey;

  @Prop()
  billingCycle?: string;

  @Prop()
  trialEndsAt?: string;

  @Prop({ default: false })
  paidUser: boolean;

  @Prop()
  lastActiveAt?: Date;

  @Prop()
  lastLoginAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExternalUserSchema = SchemaFactory.createForClass(ExternalUser);
