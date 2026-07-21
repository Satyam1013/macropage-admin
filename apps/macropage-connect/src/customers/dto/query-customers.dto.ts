import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@app/common';
import type { BillingPlanKey } from '../../external/schemas/user.schema';

export class QueryCustomersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(['TRIAL', 'STARTER', 'GROWTH', 'BUSINESS', 'ENTERPRISE'])
  billingPlan?: BillingPlanKey;

  @IsOptional()
  @IsMongoId()
  tagId?: string;
}
