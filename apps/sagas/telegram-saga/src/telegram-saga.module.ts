import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { rabbitProviders } from '@libs/transport-rabbitmq';
import { LoggerMiddleware } from '@libs/middleware';
import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { ConfigModule } from '@libs/config';

import { FileSagaController } from './telegram-saga.controller';
import { FileSagaService } from './telegram-saga.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 60000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FileSagaController],
  providers: [
    FileSagaService,
    {
      provide: LOGGER_SERVICE,
      useClass: LoggerService,
    },
    ...rabbitProviders,
  ],
})
export class FileSagaModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(FileSagaController);
  }
}
