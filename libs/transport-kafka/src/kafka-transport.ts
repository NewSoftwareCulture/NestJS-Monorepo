import {
  CustomTransportStrategy,
  MessageHandler,
  Server,
} from '@nestjs/microservices';
import {
  ConsumerConfig,
  ConsumerRunConfig,
} from '@nestjs/microservices/external/kafka.interface';
import { Consumer, Kafka } from 'kafkajs';

import { KafkaDto } from '@libs/config/dto/kafka.dto';

import { KafkaClient } from './kafka-client';
import { TransportType } from './constants';

type Config = KafkaDto & {
  consumer: ConsumerConfig;
};

export class KafkaTransportStrategy
  extends Server
  implements CustomTransportStrategy
{
  private client: Kafka;
  private consumers: Consumer[] = [];
  private log: any;
  private config: Config;

  constructor(config: Config, log?: any) {
    super();

    this.config = config;
    this.log = log || console;
    this.createClient();
  }

  createClient() {
    this.client = new KafkaClient(this.config).getInstance();
  }

  private async bindHandlers() {
    const handlers = Array.from(this.messageHandlers.entries());

    const eventHandlers = handlers.filter(
      ([, handler]: [string, MessageHandler]) => handler.isEventHandler,
    );

    // TODO: добавить поддержку message pattern
    // const messageHandlers = handlers.filter(
    //   ([, handler]: [string, MessageHandler]) => !handler.isEventHandler,
    // );

    await Promise.allSettled(
      eventHandlers.map(async ([info, handler]: [string, MessageHandler]) => {
        const { topic, type, consumer: consumerConfig } = JSON.parse(info);

        this.log.debug(`connecting... ${topic} type ${type}`);

        const config = { ...this.config.consumer, ...consumerConfig };
        const consumer = this.client.consumer(config);

        await consumer.subscribe({ topic, fromBeginning: true });

        const runConfig: ConsumerRunConfig = {};

        if (type === TransportType.MESSAGE) {
          runConfig.eachMessage = handler.bind(this);
        }
        if (type === TransportType.BATCH) {
          runConfig.eachBatch = handler.bind(this);
        }

        await consumer.run(runConfig);

        this.consumers.push(consumer);
        this.log.debug(`runned! ${topic}`);
      }),
    );
  }

  async listen(callback: () => void) {
    await this.bindHandlers();
    callback();
  }

  close() {
    this.consumers.forEach((consumer) => {
      process.once('SIGINT', () => consumer.disconnect());
      process.once('SIGTERM', () => consumer.disconnect());
    });
  }
}
