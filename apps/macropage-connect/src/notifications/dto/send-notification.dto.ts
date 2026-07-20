import { IsArray, IsEnum, IsMongoId, IsString } from 'class-validator';
import type { NotificationChannel } from '../schemas/notification.schema';

export class SendNotificationDto {
  @IsString()
  title: string;

  @IsString()
  body: string;

  @IsEnum(['whatsapp', 'sms'])
  channel: NotificationChannel;

  @IsEnum(['tag', 'customer'])
  targetType: 'tag' | 'customer';

  @IsArray()
  @IsMongoId({ each: true })
  targetIds: string[];
}
