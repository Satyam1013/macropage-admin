import { Controller, Get, Param } from '@nestjs/common';
import { PlansService } from './plans.service';

@Controller('macropage-connect/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  getCatalog() {
    return this.plansService.getCatalog();
  }

  @Get('customer/:tenantId')
  getHistoryForCustomer(@Param('tenantId') tenantId: string) {
    return this.plansService.getPaymentHistory(tenantId);
  }

  @Get('customer/:tenantId/current')
  getCurrentSubscription(@Param('tenantId') tenantId: string) {
    return this.plansService.getCurrentSubscription(tenantId);
  }
}
