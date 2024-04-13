import { Reflector } from '@nestjs/core';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Redis } from 'ioredis';

import { LoggerService, LOGGER_SERVICE } from '@libs/logger';
import { REDIS_CLIENT } from '@libs/redis';

const REDIS_LIMIT = 1; // requests
const REDIS_EXPIRE = 10 * 60; // sec

@Injectable()
export class TelegramRateLimitGuard implements CanActivate {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.getArgByIndex(0);

    const { id } = ctx.from;

    const limit =
      this.reflector.get('rateLimit', context.getHandler()) || REDIS_LIMIT;
    const expire =
      this.reflector.get('rateLimitExpire', context.getHandler()) ||
      REDIS_EXPIRE;
    const text = this.reflector.get('rateLimitText', context.getHandler());

    const redisKey = `rate-limit-${id}`;

    const count = await this.redis.incr(redisKey);

    if (limit && count > limit) {
      if (text) ctx.reply(text);

      this.logger.warn(
        `Too many requests from userId: ${id}, requests: ${count}/${limit}`,
      );
      return false;
    }

    await this.redis.expire(redisKey, expire);

    return true;
  }
}
