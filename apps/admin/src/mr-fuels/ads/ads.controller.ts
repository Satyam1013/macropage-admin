import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';

@Controller('mr-fuels/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get()
  findAll() {
    return this.adsService.findAll();
  }

  @Get('active')
  findActive(@Query('customerId') customerId?: string) {
    return this.adsService.findActive(customerId);
  }

  @Post()
  create(@Body() dto: CreateAdDto) {
    return this.adsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAdDto) {
    return this.adsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adsService.remove(id);
  }
}
