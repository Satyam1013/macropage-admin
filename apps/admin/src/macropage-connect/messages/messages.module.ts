import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ExternalMessage,
  ExternalMessageSchema,
} from '../external/schemas/message.schema';
import {
  ExternalUser,
  ExternalUserSchema,
} from '../external/schemas/user.schema';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalMessage.name, schema: ExternalMessageSchema },
      { name: ExternalUser.name, schema: ExternalUserSchema },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
  exports: [MessagesService, MongooseModule],
})
export class MessagesModule {}
