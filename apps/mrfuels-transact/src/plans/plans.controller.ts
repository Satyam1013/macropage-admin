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

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Post()
  @Roles('super-admin')
  create(@Body() dto: CreatePlanDto) {
    return this.plansService.create(dto);
  }

  @Patch(':id')
  @Roles('super-admin')
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(id, dto);
  }

  @Delete(':id')
  @Roles('super-admin')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }

  @Get('customer/:adminId')
  getHistoryForAdmin(@Param('adminId') adminId: string) {
    return this.plansService.getHistoryForAdmin(adminId);
  }

  @Get('customer/:adminId/current')
  getCurrentSubscription(@Param('adminId') adminId: string) {
    return this.plansService.getCurrentSubscription(adminId);
  }
}
