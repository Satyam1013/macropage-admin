import { Module } from '@nestjs/common';
import { MacropagePortalController } from './macropage-portal.controller';
import { MacropagePortalService } from './macropage-portal.service';

@Module({
  controllers: [MacropagePortalController],
  providers: [MacropagePortalService],
})
export class MacropagePortalModule {}
