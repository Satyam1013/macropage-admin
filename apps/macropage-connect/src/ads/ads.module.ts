import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ad, AdSchema } from './schemas/ad.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ad.name, schema: AdSchema },
      { name: Customer.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
