import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { ConfigModule } from '@libs/config';
import { LOGGER_SERVICE_DI, LoggerService } from '@libs/logger';
import { LoggerMiddleware } from '@libs/middleware';

import { HealthcheckServiceController } from './healthcheck-service.controller';
import { HealthcheckServiceService } from './healthcheck-service.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [HealthcheckServiceController],
  providers: [
    HealthcheckServiceService,
    {
      provide: LOGGER_SERVICE_DI,
      useClass: LoggerService,
    },
  ],
})
export class HealthcheckServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(HealthcheckServiceController);
  }
}
