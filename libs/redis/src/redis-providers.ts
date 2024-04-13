import { Redis } from 'ioredis';

import { ConfigService } from '@libs/config';

import { REDIS_CLIENT } from './constants';

export const redisProviders = [
  {
    provide: REDIS_CLIENT,
    useFactory: (configService: ConfigService) => {
      const redis = configService.get('redis');

      const redisInstance = new Redis(redis);

      redisInstance.on('error', (e) => {
        throw new Error(`Redis connection failed: ${e}`);
      });

      return redisInstance;
    },
    inject: [ConfigService],
  },
];
