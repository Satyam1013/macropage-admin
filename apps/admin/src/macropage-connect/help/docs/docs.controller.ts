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
import { DocsService } from './docs.service';
import { CreateDocDto } from './dto/create-doc.dto';
import { UpdateDocDto } from './dto/update-doc.dto';

@Controller('macropage-connect/help/docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get()
  findAll(@Query('category') category?: string) {
    return this.docsService.findAll(category);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDocDto) {
    return this.docsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDocDto) {
    return this.docsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docsService.remove(id);
  }
}
