import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { RabbitMQTransportStrategy } from '@libs/transport-rabbitmq';
import { LoggerService } from '@libs/logger';
import { ConfigService } from '@libs/config';

import { FileSagaModule } from './telegram-saga.module';

const whiteList = ['http://localhost:3000'];

async function bootstrap() {
  const app = await NestFactory.create(FileSagaModule, {
    cors: {
      origin: whiteList,
    },
  });

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  const logger = new LoggerService(configService);

  app.connectMicroservice<MicroserviceOptions>({
    strategy: new RabbitMQTransportStrategy(configService),
  });

  // Add Winston logger
  app.useLogger(logger);

  // Add route prefix
  app.setGlobalPrefix('api/v1');

  // Start telegram and web-server
  await app.startAllMicroservices();
  await app.listen(port);

  logger.info(`🔥 Server run on port: ${port}`);
}
bootstrap();
