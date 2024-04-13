import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { rabbitProviders } from '@libs/transport-rabbitmq';
import { LoggerMiddleware } from '@libs/middleware';
import { ConfigModule } from '@libs/config';

// Controllers
import { BotHealthcheckController } from './controllers/bot-worker-healthcheck.controller';
import { BotRabbitController } from './controllers/bot-worker-rabbit.controller';
import { BotTelegramController } from './controllers/bot-worker-telegram.controller';

// Services
import { BotRabbitService } from './services/bot-worker-rabbit.service';
import { BotTelegramService } from './services/bot-worker-telegram.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    BotHealthcheckController,
    BotRabbitController,
    BotTelegramController,
  ],
  providers: [
    BotRabbitService,
    BotTelegramService,
    {
      provide: LOGGER_SERVICE,
      useClass: LoggerService,
    },
    ...rabbitProviders,
  ],
})
export class BotModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(BotHealthcheckController);
    consumer.apply(LoggerMiddleware).forRoutes(BotRabbitController);
    consumer.apply(LoggerMiddleware).forRoutes(BotTelegramController);
  }
}
