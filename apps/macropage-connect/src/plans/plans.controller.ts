import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PurchasePlanDto } from './dto/purchase-plan.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Post()
  @Roles('super-admin')
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Delete(':id')
  @Roles('super-admin')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }

  @Post('purchase')
  purchase(@Body() dto: PurchasePlanDto) {
    return this.plansService.purchaseOrRenew(dto);
  }

  @Get('customer/:customerId')
  getHistoryForCustomer(@Param('customerId') customerId: string) {
    return this.plansService.getHistoryForCustomer(customerId);
  }
}
