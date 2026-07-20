import { NestFactory } from '@nestjs/core';
import { MrfuelsTransactModule } from './mrfuels-transact.module';

async function bootstrap() {
  const app = await NestFactory.create(MrfuelsTransactModule);
  await app.listen(process.env.MRFUELS_TRANSACT_PORT ?? 3002);
}
bootstrap();
