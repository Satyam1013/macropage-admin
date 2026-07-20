import { IsMongoId } from 'class-validator';

export class PurchasePlanDto {
  @IsMongoId()
  customerId: string;

  @IsMongoId()
  planId: string;
}
