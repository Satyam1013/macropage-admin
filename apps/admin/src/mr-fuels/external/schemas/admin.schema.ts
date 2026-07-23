import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Mirrors `Admin` from the mr-fuels backend (collection: "admins").
 * This is the pump owner / paying subscriber — the "customer" for this admin app.
 * Manager/Staff accounts live in separate `managers`/`staffs` collections, not here.
 * Read-only — this app never writes here. Always read via `.lean()` or with the
 * password field excluded; `role` is unreliable (missing on ~58/74 real docs from
 * before the field existed) so don't filter customers by it.
 */
export type ExternalAdminDocument = HydratedDocument<ExternalAdmin>;

@Schema({ collection: 'admins', strict: false })
export class ExternalAdmin {
  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  dealerCode: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  mobileNo: string;

  @Prop()
  role?: string;

  @Prop({ default: false })
  setupComplete: boolean;

  @Prop()
  currentSubscriptionId?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ExternalAdminSchema = SchemaFactory.createForClass(ExternalAdmin);
