import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  durationDays?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  messageQuota?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
