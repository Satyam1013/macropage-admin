import { Controller, Get } from '@nestjs/common';
import { MrfuelsTransactService } from './mrfuels-transact.service';

@Controller()
export class MrfuelsTransactController {
  constructor(private readonly mrfuelsTransactService: MrfuelsTransactService) {}

  @Get()
  getHello(): string {
    return this.mrfuelsTransactService.getHello();
  }
}
