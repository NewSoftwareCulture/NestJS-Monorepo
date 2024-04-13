import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@libs/config';

import { RABBIT_CLIENT } from './config/client';
import { getOptions } from './config/getOptions';

export const rabbitProviders = Object.values(RABBIT_CLIENT).map((value) => {
  return {
    provide: value,
    useFactory: (configService: ConfigService) => {
      const { rabbit } = configService.get('transport');
      const options = getOptions({ ...rabbit, queue: value });

      options.noAck = true;

      return ClientProxyFactory.create({ transport: Transport.RMQ, options });
    },
    inject: [ConfigService],
  };
});
