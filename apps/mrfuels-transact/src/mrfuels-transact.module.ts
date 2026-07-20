import { Module } from '@nestjs/common';
import { MrfuelsTransactController } from './mrfuels-transact.controller';
import { MrfuelsTransactService } from './mrfuels-transact.service';

@Module({
  imports: [],
  controllers: [MrfuelsTransactController],
  providers: [MrfuelsTransactService],
})
export class MrfuelsTransactModule {}
