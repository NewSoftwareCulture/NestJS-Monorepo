import { Inject, Injectable } from '@nestjs/common';
import { LoggerService as NestLoggerService } from '@nestjs/common';
import { LOGGER_CLIENT } from './constants';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  constructor(@Inject(LOGGER_CLIENT) private readonly logger: winston.Logger) {}

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
