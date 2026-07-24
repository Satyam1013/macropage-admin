import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import type {
  TemplateCategory,
  TemplateChannel,
} from '../schemas/template.schema';

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['whatsapp', 'sms', 'push'])
  channel?: TemplateChannel;

  @IsOptional()
  @IsEnum(['marketing', 'utility', 'authentication'])
  category?: TemplateCategory;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
