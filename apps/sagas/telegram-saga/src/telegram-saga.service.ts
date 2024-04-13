import { ClientProxy } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { randomUUID } from 'crypto';

import { RABBIT_CLIENT, buildMessage } from '@libs/transport-rabbitmq';
import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { ConfigService } from '@libs/config';

import { Payload, PipelineEntity } from './telegram-saga.dto';

@Injectable()
export class FileSagaService {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    @Inject(RABBIT_CLIENT.BOT_SERVICE)
    private readonly botService: ClientProxy,
    private readonly configService: ConfigService,
  ) {}

  private readonly pipeline: PipelineEntity[] = [
    {
      service: this.botService,
      pattern: 'ping',
    },
  ];

  private readonly errorPipeline: PipelineEntity[] = [
    {
      service: this.botService,
      pattern: 'error',
    },
  ];

  async emit(payload: Payload) {
    const { meta, uuid } = payload;
    const { service, pattern } = this.pipeline[meta.step] || {};

    if (meta.step === this.pipeline.length) {
      this.logger.info(
        `Telegram saga is finished success by step ${meta.step}. Uuid: ${uuid}`,
      );
      return;
    }

    const observe = await service.emit(pattern, buildMessage(payload));
    await lastValueFrom(observe);
  }

  async emitError(payload: Payload) {
    await Promise.allSettled(
      this.errorPipeline.map(async ({ service, pattern }) => {
        const observe = await service.emit(pattern, buildMessage(payload));
        await lastValueFrom(observe);
      }),
    );
  }

  async run(payload: Payload): Promise<string> {
    const { uuid = randomUUID(), meta = {}, data = {} } = payload;

    const { step = 0, status = 'telegram-saga.run', error } = meta;

    const newPayload: Payload = {
      uuid,
      meta: {
        step,
        status,
        error,
      },
      data,
    };

    if (error) {
      await this.emitError(newPayload);
    } else {
      await this.emit(newPayload);
    }

    return 'done';
  }
}
