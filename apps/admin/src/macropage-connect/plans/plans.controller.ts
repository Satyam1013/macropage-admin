import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Roles } from '../../auth/decorators/roles.decorator';
import { PlansService } from './plans.service';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller('macropage-connect/plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  getCatalog() {
    return this.plansService.getCatalog();
  }

  @Patch(':planId')
  @Roles('super-admin')
  update(@Param('planId') planId: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(planId, dto);
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
