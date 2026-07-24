import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type {
  TemplateCategory,
  TemplateHeaderFormat,
} from '../schemas/template.schema';

export class TemplateHeaderDto {
  @IsEnum(['TEXT', 'IMAGE', 'VIDEO', 'DOCUMENT'])
  format!: TemplateHeaderFormat;

  @IsOptional()
  @IsString()
  text?: string;
}

export class TemplateButtonDto {
  @IsString()
  type!: string;

  @IsString()
  text!: string;
}

export class TemplateButtonsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateButtonDto)
  buttons!: TemplateButtonDto[];
}

export class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsEnum(['MARKETING', 'UTILITY', 'AUTHENTICATION'])
  category!: TemplateCategory;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateHeaderDto)
  header?: TemplateHeaderDto;

  @IsString()
  body!: string;

  @IsOptional()
  @IsString()
  footer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TemplateButtonsDto)
  buttons?: TemplateButtonsDto;

  @IsOptional()
  @IsObject()
  sampleVariables?: Record<string, string>;

  @IsOptional()
  @IsObject()
  variableTypes?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
