import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IntegrationPlatformsService } from './integration-platforms.service';
import { CreateIntegrationPlatformDto } from './dto/create-integration-platform.dto';
import { UpdateIntegrationPlatformDto } from './dto/update-integration-platform.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { QueryIntegrationPlatformsDto } from './dto/query-integration-platforms.dto';

@Controller('macropage-connect/integration-platforms')
export class IntegrationPlatformsController {
  constructor(
    private readonly integrationPlatformsService: IntegrationPlatformsService,
  ) {}

  @Get()
  findAll(@Query() query: QueryIntegrationPlatformsDto) {
    return this.integrationPlatformsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.integrationPlatformsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateIntegrationPlatformDto) {
    return this.integrationPlatformsService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIntegrationPlatformDto) {
    return this.integrationPlatformsService.update(id, dto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.integrationPlatformsService.updateStatus(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.integrationPlatformsService.remove(id);
  }
}
