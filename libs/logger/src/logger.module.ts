import { Global, Module } from '@nestjs/common';

import { ConfigModule } from '@libs/config';

import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService, ConfigModule],
  exports: [LoggerService],
})
export class LoggerModule {}
