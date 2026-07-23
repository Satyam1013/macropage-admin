import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ad, AdSchema } from './schemas/ad.schema';
import { TagsModule } from '../tags/tags.module';
import { AdsService } from './ads.service';
import { AdsController } from './ads.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Ad.name, schema: AdSchema }], 'mrFuels'),
    TagsModule,
  ],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService],
})
export class AdsModule {}
