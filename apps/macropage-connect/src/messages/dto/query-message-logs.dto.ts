import { IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '@app/common';
import type { MessageChannel, MessageStatus } from '../schemas/message-log.schema';

export class QueryMessageLogsDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsOptional()
  @IsEnum(['whatsapp', 'sms'])
  channel?: MessageChannel;

  @IsOptional()
  @IsEnum(['sent', 'failed'])
  status?: MessageStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
