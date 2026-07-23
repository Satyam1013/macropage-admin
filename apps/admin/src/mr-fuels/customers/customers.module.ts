import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExternalAdmin, ExternalAdminSchema } from '../external/schemas/admin.schema';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { PlansModule } from '../plans/plans.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ExternalAdmin.name, schema: ExternalAdminSchema }],
      'mrFuels',
    ),
    PlansModule,
    TagsModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService, MongooseModule],
})
export class CustomersModule {}
