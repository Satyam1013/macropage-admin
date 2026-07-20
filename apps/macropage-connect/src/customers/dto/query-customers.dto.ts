import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@app/common';
import type { CustomerStatus } from '../schemas/customer.schema';

export class QueryCustomersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: CustomerStatus;

  @IsOptional()
  @IsMongoId()
  tagId?: string;
}
