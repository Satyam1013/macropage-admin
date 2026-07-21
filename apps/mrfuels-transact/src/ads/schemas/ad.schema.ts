import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdType = 'popup' | 'banner' | 'inline';
export type AdTargetType = 'all' | 'tag' | 'customer';

export type AdDocument = HydratedDocument<Ad>;

@Schema({ timestamps: true })
export class Ad {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ required: true, enum: ['popup', 'banner', 'inline'] })
  type: AdType;

  @Prop({ required: true, enum: ['all', 'tag', 'customer'], default: 'all' })
  targetType: AdTargetType;

  @Prop({ type: [Types.ObjectId], default: [] })
  targetIds: Types.ObjectId[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ default: 0 })
  priority: number;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
