import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerStatus = 'active' | 'inactive' | 'blocked';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, trim: true })
  phone: string;

  @Prop({ trim: true, lowercase: true })
  email?: string;

  @Prop({
    required: true,
    enum: ['active', 'inactive', 'blocked'],
    default: 'active',
  })
  status: CustomerStatus;

  @Prop({ type: [Types.ObjectId], ref: 'Tag', default: [] })
  tagIds: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
CustomerSchema.index({ name: 'text', phone: 'text', email: 'text' });
