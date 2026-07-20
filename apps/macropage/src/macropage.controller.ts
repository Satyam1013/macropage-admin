import { Controller, Get } from '@nestjs/common';
import { MacropageService } from './macropage.service';

@Controller()
export class MacropageController {
  constructor(private readonly macropageService: MacropageService) {}

  @Get()
  getHello(): string {
    return this.macropageService.getHello();
  }
}
