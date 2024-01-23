import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { LoggerService, LOGGER_SERVICE_DI } from '@libs/logger';

@Injectable()
export class TelegramFileDurationGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_SERVICE_DI) private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.getArgByIndex(0);

    const { video, audio } = ctx.update.message;
    const { duration } = video || audio;
    const { id } = ctx.from;

    const limit = this.reflector.get('durationLimit', context.getHandler());
    const text = this.reflector.get('durationLimitText', context.getHandler());

    if (limit && duration > limit) {
      if (text) ctx.reply(text);

      this.logger.warn(
        `Too huge file duration from userId: ${id}, file duration: ${duration}/${limit}`,
      );
      return false;
    }

    return true;
  }
}
