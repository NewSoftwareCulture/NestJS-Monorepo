import { LoggerConfig } from '@libs/config/dto/logger.dto';
import {
  createLogger as createWinstonLogger,
  format,
  transports as WinstonTransports,
  Logger,
  config as WinstonConfig,
} from 'winston';
const { combine, timestamp, label: formatLabel, printf, colorize } = format;

export function createLogger(config: LoggerConfig): Logger {
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
    file: { filename, level },
    fileWarn: { filename: filenameWarn, level: 'warn' },
    fileError: { filename: filenameError, level: 'error' },
  };

  logger.add(new WinstonTransports.Console(params.console));

  if (filename) logger.add(new WinstonTransports.File(params.file));
  if (filenameWarn) logger.add(new WinstonTransports.File(params.fileWarn));
  if (filenameError) logger.add(new WinstonTransports.File(params.fileError));

  return logger;
}
