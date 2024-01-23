import { LOGGER_SERVICE_DI, LoggerService } from '@libs/logger';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(LOGGER_SERVICE_DI) private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, params, body, query, path } = req;

    const info = query || body || params;

    this.logger.info(`[${method}] ${path} ${JSON.stringify(info)} `);
    next();
  }
}
