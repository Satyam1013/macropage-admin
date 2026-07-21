import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/** Mirrors `Message` from macropage-connect (collection: "messages"). Read-only, used for usage stats only. */
export type ExternalMessageDocument = HydratedDocument<ExternalMessage>;

export type MessageDirection = 'INBOUND' | 'OUTBOUND';
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';

@Schema({ collection: 'messages', strict: false, timestamps: { createdAt: true, updatedAt: false } })
export class ExternalMessage {
  @Prop({ required: true })
  conversationId: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: String, required: true })
  direction: MessageDirection;

  @Prop({ type: String })
  status?: MessageStatus;

  @Prop()
  sentAt?: Date;

  @Prop()
  failedAt?: Date;

  createdAt?: Date;
}

export const ExternalMessageSchema = SchemaFactory.createForClass(ExternalMessage);
