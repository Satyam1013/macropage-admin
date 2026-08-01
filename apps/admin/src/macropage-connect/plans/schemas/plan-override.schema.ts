import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanOverrideDocument = HydratedDocument<PlanOverride>;

/**
 * Stores admin edits to the otherwise static public pricing catalog. Keeping
 * this separate means the product-owned billing collections remain untouched.
 */
@Schema({ timestamps: true, collection: 'adminplanoverrides' })
export class PlanOverride {
  @Prop({ required: true, unique: true, immutable: true })
  planId!: string;

  @Prop({ required: true, type: Object })
  plan!: Record<string, unknown>;
}

export const PlanOverrideSchema = SchemaFactory.createForClass(PlanOverride);
