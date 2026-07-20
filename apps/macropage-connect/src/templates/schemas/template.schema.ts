import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TemplateChannel = 'whatsapp' | 'sms' | 'push';

export type TemplateDocument = HydratedDocument<Template>;

@Schema({ timestamps: true })
export class Template {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: ['whatsapp', 'sms', 'push'] })
  channel: TemplateChannel;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  variables: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
