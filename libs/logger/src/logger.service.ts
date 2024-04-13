import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { Logger } from 'winston';

import { ConfigService } from '@libs/config';

import { createLogger } from './logger';

const prepareMessage = (message) =>
  typeof message === 'string'
    ? message
    : JSON.stringify(message, Object.getOwnPropertyNames(message));

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: Logger;

  constructor(private readonly configService: ConfigService) {
    const config = configService.get('logger');
    this.logger = createLogger(config);
  }

  log(message: any, ...optionalParams: any[]) {
    return this.logger.info(prepareMessage(message), ...optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    return this.logger.info(prepareMessage(message), ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    return this.logger.error(prepareMessage(message), ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    return this.logger.warn(prepareMessage(message), ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    return this.logger.debug(prepareMessage(message), ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    return this.logger.verbose(prepareMessage(message), ...optionalParams);
  }

  silly(message: any, ...optionalParams: any[]) {
    return this.logger.silly(prepareMessage(message), ...optionalParams);
  }
}
