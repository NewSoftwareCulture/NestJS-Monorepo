import { ClientProxy, RmqContext } from '@nestjs/microservices';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, lastValueFrom, of } from 'rxjs';

import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { delay } from '@libs/utils';

import { RABBIT_CLIENT } from './config';
import { buildMessage } from './helpers';

const RETRY_TIMEOUT = 1000;
const RETRY_COUNT = 5;

@Injectable()
export class RabbitMQInterceptor implements NestInterceptor {
  private storage = new Map();

  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    // TODO: move to param
    @Inject(RABBIT_CLIENT.TELEGRAM_SAGA)
    private readonly saga: ClientProxy,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const payload = context.getArgByIndex(0);
    const rmqCtx = context.getArgByIndex<RmqContext>(1);

    const message = rmqCtx.getMessage();
    const channel = rmqCtx.getChannelRef();

    try {
      const res = await lastValueFrom(next.handle());
      await channel.ack(message);
      return of(res);
    } catch (err) {
      this.logger.error(err.message);
      const [args] = rmqCtx.getArgs();
      const {
        fields: { redelivered },
        properties: { messageId },
      } = args;

      const count = this.storage.get(messageId) || 1;

      this.storage.set(messageId, count + 1);

      await delay(RETRY_TIMEOUT);

      this.logger.error(`Retry message by id ${messageId}. Count: ${count}`);

      if (redelivered && count >= RETRY_COUNT) {
        this.logger.error(
          `Reply message by id ${messageId} to dead letter queue`,
        );

        await channel.reject(message, false);
        this.storage.delete(messageId);

        payload.meta.error = err.message;

        const observeSaga = this.saga.emit(
          'upload-file',
          buildMessage(payload),
        );
        await lastValueFrom(observeSaga);
      } else {
        await channel.nack(message, false, true);
      }
      return of(err);
    }
  }
}
