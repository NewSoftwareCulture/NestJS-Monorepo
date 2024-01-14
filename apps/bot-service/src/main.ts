import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { TelegramTransportStrategy } from '@libs/transport-telegram';
import { LoggerService, LoggerModule } from '@libs/logger';
import { ConfigService } from '@libs/config';
import { findByName } from '@libs/utils';

import { BotModule } from './bot-service.module';

const whiteList = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(BotModule, {
    cors: {
      origin: whiteList,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');
  const bots = configService.get('bot');
  const logConfig = configService.get('logger');

  const logger = LoggerModule.createLogger(logConfig);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new TelegramTransportStrategy(
      findByName(bots, 'bot-service'),
      logger,
    ),
  });

  // Add Winston logger
  app.useLogger(new LoggerService(logger));

  // Add route prefix
  app.setGlobalPrefix('api/v1');

  // Start telegram and web-server
  app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
