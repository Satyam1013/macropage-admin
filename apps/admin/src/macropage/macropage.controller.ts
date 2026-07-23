import { Controller, Get } from '@nestjs/common';
import { Public } from '@app/common';
import { MacropageService } from './macropage.service';

@Controller('macropage')
export class MacropageController {
  constructor(private readonly macropageService: MacropageService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.macropageService.getHello();
  }
}
