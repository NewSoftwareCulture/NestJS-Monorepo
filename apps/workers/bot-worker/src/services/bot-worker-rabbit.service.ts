import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { ConfigService } from '@libs/config';
import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { RABBIT_CLIENT, buildMessage } from '@libs/transport-rabbitmq';

@Injectable()
export class BotRabbitService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    @Inject(RABBIT_CLIENT.TELEGRAM_SAGA)
    private readonly saga: ClientProxy,
  ) {}

  async pong(payload): Promise<void> {
    payload.meta.step += 1;
    payload.meta.status = 'bot-service.pong';

    payload.data.message = 'pong';

    const observeSaga = this.saga.emit('base-flow', buildMessage(payload));
    await lastValueFrom(observeSaga);
  }
}
