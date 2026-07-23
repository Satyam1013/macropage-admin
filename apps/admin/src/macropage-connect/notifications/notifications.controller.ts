import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { BroadcastNotificationDto } from './dto/broadcast-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('macropage-connect/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Post('broadcast')
  broadcastToAll(@Body() dto: BroadcastNotificationDto) {
    return this.notificationsService.broadcastToAll(dto);
  }

  @Post('send')
  sendToTargets(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendToTargets(dto);
  }
}
