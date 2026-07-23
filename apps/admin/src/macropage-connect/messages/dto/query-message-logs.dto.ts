import { IsDateString, IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { PaginationDto } from '@app/common';
import type { MessageStatus } from '../../external/schemas/message.schema';

export class QueryMessageLogsDto extends PaginationDto {
  @IsOptional()
  @IsMongoId()
  customerId?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED'])
  status?: MessageStatus;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
}
