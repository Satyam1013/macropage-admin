import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import type { TemplateChannel } from '../schemas/template.schema';

export class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsEnum(['whatsapp', 'sms', 'push'])
  channel!: TemplateChannel;

  @IsString()
  content!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  variables?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
