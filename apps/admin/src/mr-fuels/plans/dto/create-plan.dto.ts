import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { PlanName, PlanStatus, DurationType, Currency } from '../schemas/plan.schema';

export class DurationDto {
  @IsEnum(['trial', 'monthly', 'yearly'])
  durationType: DurationType;

  @IsNumber()
  months: number;
}

export class PricingDto {
  @IsNumber()
  originalPrice: number;

  @IsNumber()
  finalPrice: number;

  @IsEnum(['INR'])
  currency: Currency;

  @IsBoolean()
  isFree: boolean;
}

export class TrialDto {
  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsNumber()
  trialDays?: number;
}

export class TagsDto {
  @IsOptional()
  @IsBoolean()
  mostPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  discounted?: boolean;

  @IsOptional()
  @IsBoolean()
  freeTrial?: boolean;
}

export class UiDto {
  @IsOptional()
  @IsString()
  badgeText?: string;

  @IsOptional()
  @IsString()
  badgeColor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gradient?: string[];
}

export class CreatePlanDto {
  @IsString()
  id: string;

  @IsEnum(['pro', 'premium'])
  name: PlanName;

  @IsNumber()
  tier: number;

  @IsString()
  description: string;

  @ValidateNested()
  @Type(() => DurationDto)
  duration: DurationDto;

  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;

  @ValidateNested()
  @Type(() => TrialDto)
  trial: TrialDto;

  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => TagsDto)
  tags?: TagsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UiDto)
  ui?: UiDto;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: PlanStatus;
}
