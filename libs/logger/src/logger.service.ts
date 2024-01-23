import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';

import { ConfigService } from '@libs/config';

import { createLogger } from './logger';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const config = configService.get('logger');
    this.logger = createLogger(config);
  }

  log(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    return this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    return this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    return this.logger.warn(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    return this.logger.debug(message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    return this.logger.verbose(message, ...optionalParams);
  }

  silly(message: any, ...optionalParams: any[]) {
    return this.logger.silly(message, ...optionalParams);
  }
}
