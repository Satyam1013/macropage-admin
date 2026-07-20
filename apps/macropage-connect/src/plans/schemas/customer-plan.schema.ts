import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerPlanStatus = 'active' | 'expired' | 'cancelled';

export type CustomerPlanDocument = HydratedDocument<CustomerPlan>;

@Schema({ timestamps: true })
export class CustomerPlan {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Plan', required: true })
  planId: Types.ObjectId;

  @Prop({ default: Date.now })
  purchasedAt: Date;

  @Prop()
  renewedAt?: Date;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  })
  status: CustomerPlanStatus;
}

export const CustomerPlanSchema = SchemaFactory.createForClass(CustomerPlan);
