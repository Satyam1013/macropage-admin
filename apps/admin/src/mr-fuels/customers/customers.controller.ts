import { Controller, Get, Param, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { QueryCustomersDto } from './dto/query-customers.dto';

@Controller('mr-fuels/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() query: QueryCustomersDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/profile')
  getProfile(@Param('id') id: string) {
    return this.customersService.getProfile(id);
  }
}
