import { Module } from '@nestjs/common';
import { MacropageController } from './macropage.controller';
import { MacropageService } from './macropage.service';

@Module({
  imports: [],
  controllers: [MacropageController],
  providers: [MacropageService],
})
export class MacropageModule {}
