import { LoggerDto } from '@libs/config/dto/logger.dto';
import {
  createLogger as createWinstonLogger,
  format,
  transports as WinstonTransports,
  Logger,
  config as WinstonConfig,
} from 'winston';
import * as path from 'path';

const { combine, timestamp, label: formatLabel, printf, colorize } = format;

export function createLogger(config: LoggerDto): Logger {
  const {
    level = 'debug',
    label = 'app',
    directory = 'logs',
    file = false,
    file_warn = false,
    file_error = false,
  } = config || {};

  const customFormat = printf(({ level, message, label, timestamp }) => {
    const date = new Date(timestamp).toUTCString();
    return `${date} [${label}] ${level}: ${message}`;
  });

  const logger = createWinstonLogger({
    levels: WinstonConfig.npm.levels,
    format: combine(
      colorize(),
      formatLabel({ label }),
      timestamp(),
      customFormat,
    ),
  });

  const params = {
    console: { level },
    file: { filename: path.resolve(directory, `${label}.log`), level },
    fileWarn: {
      filename: path.resolve(directory, `${label}.warn.log`),
      level: 'warn',
    },
    fileError: {
      filename: path.resolve(directory, `${label}.error.log`),
      level: 'error',
    },
  };

  logger.add(new WinstonTransports.Console(params.console));

  if (file) logger.add(new WinstonTransports.File(params.file));
  if (file_warn) logger.add(new WinstonTransports.File(params.fileWarn));
  if (file_error) logger.add(new WinstonTransports.File(params.fileError));

  return logger;
}
