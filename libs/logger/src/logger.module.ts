import { DynamicModule, Global, Module } from '@nestjs/common';
import {
  createLogger,
  format,
  transports as winstonTransports,
  Logger,
  config as winstonConfig,
} from 'winston';
const { combine, timestamp, label: formatLabel, printf, colorize } = format;

import { LoggerService } from './logger.service';
import { RegisterAsyncOptions } from './logger.dto';
import { LOGGER_CLIENT } from './constants';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static createLogger(config): Logger {
    const {
      level = 'debug',
      label = 'app',
      filename,
      filenameWarn,
      filenameError,
    } = config || {};

    const customFormat = printf(({ level, message, label, timestamp }) => {
      const date = new Date(timestamp).toUTCString();
      return `${date} [${label}] ${level}: ${message}`;
    });

    const logger = createLogger({
      levels: winstonConfig.npm.levels,
      format: combine(
        colorize(),
        formatLabel({ label }),
        timestamp(),
        customFormat,
      ),
    });

    const params = {
      console: { level },
      file: { filename, level },
      fileWarn: { filename: filenameWarn, level: 'warn' },
      fileError: { filename: filenameError, level: 'error' },
    };

    logger.add(new winstonTransports.Console(params.console));

    if (filename) logger.add(new winstonTransports.File(params.file));
    if (filenameWarn) logger.add(new winstonTransports.File(params.fileWarn));
    if (filenameError) logger.add(new winstonTransports.File(params.fileError));

    return logger;
  }

  static registerAsync(options: RegisterAsyncOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_CLIENT,
          useFactory: async (optionsProvider) => {
            const config = options.useFactory(optionsProvider);
            return this.createLogger(config?.logger);
          },
          inject: options.inject,
        },
      ],
    };
  }
}
