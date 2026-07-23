import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ticket, TicketSchema } from './schemas/ticket.schema';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Ticket.name, schema: TicketSchema }],
      'mrFuels',
    ),
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
  exports: [TicketsService, MongooseModule],
})
export class TicketsModule {}
