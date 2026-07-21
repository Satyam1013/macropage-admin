import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema({ timestamps: true })
export class Tag {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ trim: true })
  color?: string;

  @Prop({ trim: true })
  description?: string;

  /** External `users` collection ids (customers) this tag is applied to. */
  @Prop({ type: [String], default: [] })
  customerIds: string[];
}

export const TagSchema = SchemaFactory.createForClass(Tag);
