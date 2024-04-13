import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { LoggerService, LOGGER_SERVICE } from '@libs/logger';

@Injectable()
export class TelegramFileSizeGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.getArgByIndex(0);

    const { photo, video, document } = ctx.update.message;
    const { file_size: fileSize } = photo || video || document;
    const { id } = ctx.from;

    const limit = this.reflector.get('sizeLimit', context.getHandler());
    const text = this.reflector.get('sizeLimitText', context.getHandler());

    if (limit && fileSize > limit) {
      if (text) ctx.reply(text);

      this.logger.warn(
        `Too huge file size from userId: ${id}, file size: ${fileSize}/${limit}`,
      );
      return false;
    }

    return true;
  }
}
