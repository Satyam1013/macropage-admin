import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Read-only mirror of macropage-connect's tenant-scoped contacts collection. */
export type ExternalContactDocument = HydratedDocument<ExternalContact>;

@Schema({ collection: 'contacts', strict: false })
export class ExternalContact {
  @Prop({ required: true })
  tenantId!: string;
}

export const ExternalContactSchema =
  SchemaFactory.createForClass(ExternalContact);
