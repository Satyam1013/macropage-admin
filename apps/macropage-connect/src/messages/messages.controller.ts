import { Controller, Get, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { QueryMessageLogsDto } from './dto/query-message-logs.dto';
import { QueryMessageStatsDto } from './dto/query-message-stats.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('logs')
  findLogs(@Query() query: QueryMessageLogsDto) {
    return this.messagesService.findLogs(query);
  }

  @Get('stats')
  getStats(@Query() query: QueryMessageStatsDto) {
    return this.messagesService.getStats(query);
  }
}
