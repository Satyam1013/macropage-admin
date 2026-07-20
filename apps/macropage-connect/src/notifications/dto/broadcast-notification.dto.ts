import { IsEnum, IsString } from 'class-validator';
import type { NotificationChannel } from '../schemas/notification.schema';

export class BroadcastNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(['whatsapp', 'sms'])
  channel: NotificationChannel;
}
