import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common';

export class QueryCustomersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  setupComplete?: boolean;

  @IsOptional()
  @IsMongoId()
  tagId?: string;
}
