import { Controller, Get } from '@nestjs/common';
import { Public } from '@app/common';
import { MacropagePortalService } from './macropage-portal.service';

@Controller('macropage-portal')
export class MacropagePortalController {
  constructor(private readonly macropagePortalService: MacropagePortalService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.macropagePortalService.getHello();
  }
}
