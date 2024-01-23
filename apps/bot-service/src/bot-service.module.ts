import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { LoggerMiddleware } from '@libs/middleware';
import { LOGGER_SERVICE_DI, LoggerService } from '@libs/logger';
import { ConfigModule } from '@libs/config';

import { BotController } from './bot-service.controller';
import { BotService } from './bot-service.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
  ],
  controllers: [BotController],
  providers: [
    BotService,
    {
      provide: LOGGER_SERVICE_DI,
      useClass: LoggerService,
    },
  ],
})
export class BotModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(BotController);
  }
}
