import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Mirrors `Payment` from macropage-connect (collection: "payments"). Read-only — each doc is one purchase/renewal event. */
export type ExternalPaymentDocument = HydratedDocument<ExternalPayment>;

@Schema({ collection: 'payments', strict: false })
export class ExternalPayment {
  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: true })
  razorpayPaymentId: string;

  @Prop()
  razorpaySubscriptionId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, default: 'success' })
  status: 'success' | 'failed' | 'refunded';

  @Prop()
  plan?: string;

  @Prop()
  billingCycle?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExternalPaymentSchema = SchemaFactory.createForClass(ExternalPayment);
