import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@libs/config';

import { BotModule } from './bot-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BotModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // TODO: add cors

  app.setGlobalPrefix('api/v1');

  await app.listen(port);
}
bootstrap();
