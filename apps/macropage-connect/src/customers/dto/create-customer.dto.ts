import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import type { CustomerStatus } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'blocked'])
  status?: CustomerStatus;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tagIds?: string[];
}
