import { Module } from '@nestjs/common';
import { TicketsModule } from './tickets/tickets.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [TicketsModule, ChatModule],
})
export class SupportModule {}
