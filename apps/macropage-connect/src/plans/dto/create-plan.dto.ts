import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsNumber()
  durationDays: number;

  @Type(() => Number)
  @IsNumber()
  messageQuota: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
