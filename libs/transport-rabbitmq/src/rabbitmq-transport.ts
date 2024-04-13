import { RmqOptions, ServerRMQ } from '@nestjs/microservices';
import { Channel } from 'amqp-connection-manager';

import { ConfigService } from '@libs/config';
import { delay } from '@libs/utils';

import { getOptions, DEAD_LETTER_POSTFIX } from './config';

const RMQ_TIMEOUT = 5000;
const RMQ_INTERVAL = 500;

export class RabbitMQTransportStrategy extends ServerRMQ {
  protected runningMessages = 0;
  protected closing = false;
  protected consumerTag: string | null = null;

  constructor(private readonly configService: ConfigService) {
    const { rabbit } = configService.get('transport');
    const options: RmqOptions['options'] = getOptions(rabbit);

    super(options);
  }

  public async setupChannel(channel: Channel, callback: () => void) {
    if (this.closing) {
      return;
    }

    if (!this.queueOptions.noAssert) {
      await channel.assertQueue(this.queue, this.queueOptions);
      await channel.assertQueue(
        `${this.queue}.${DEAD_LETTER_POSTFIX}`,
        this.queueOptions,
      );
    }
    await channel.prefetch(this.prefetchCount, this.isGlobalPrefetchCount);

    const { consumerTag } = await channel.consume(
      this.queue,
      (msg: Record<string, any>) => this.handleMessage(msg, channel),
      {
        noAck: this.noAck,
      },
    );

    this.consumerTag = consumerTag;

    callback();
  }

  protected async waitingHandlers() {
    while (this.runningMessages > 0) {
      await delay(RMQ_INTERVAL);
    }
  }

  public async handleMessage(
    message: Record<string, any>,
    channel: Channel,
  ): Promise<void> {
    this.runningMessages++;
    return super.handleMessage(message, channel).finally(() => {
      this.runningMessages--;
    });
  }

  async close(): Promise<void> {
    this.closing = true;

    if (this.channel) {
      await this.channel.removeSetup(undefined, (channel: Channel) =>
        channel.cancel(this.consumerTag),
      );
    }
    this.consumerTag = null;

    await Promise.race([
      this.waitingHandlers(),
      RMQ_TIMEOUT > 0 && delay(RMQ_TIMEOUT),
    ]);

    this.runningMessages = 0;
    super.close();
  }
}
