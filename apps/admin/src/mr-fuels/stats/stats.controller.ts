import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('mr-fuels/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard')
  getDashboard() {
    return this.statsService.getDashboard();
  }
}
