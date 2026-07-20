import { NestFactory } from '@nestjs/core';
import { MacropageModule } from './macropage.module';

async function bootstrap() {
  const app = await NestFactory.create(MacropageModule);
  await app.listen(process.env.MACROPAGE_PORT ?? 3001);
}
bootstrap();
