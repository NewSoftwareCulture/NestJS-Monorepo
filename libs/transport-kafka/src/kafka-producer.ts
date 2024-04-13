import { FactoryProvider, InjectionToken } from '@nestjs/common';
import { Producer } from 'kafkajs';

import { KafkaDto } from '@libs/config/dto/kafka.dto';
import { ConfigService } from '@libs/config';

import { KafkaClient } from './kafka-client';

export class KafkaProducer {
  private instance: Producer;

  constructor(config: KafkaDto) {
    this.createProducer(config);
  }

  createProducer(config: KafkaDto) {
    const kafka = new KafkaClient(config).getClient();

    this.instance = kafka.producer();

    this.instance.connect();
  }

  getInstance() {
    return this.instance;
  }
}

export function provideKafkaProducer(
  injectionToken: InjectionToken,
): FactoryProvider<Producer> {
  return {
    provide: injectionToken,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const config = configService.get('transport').kafka;

      return new KafkaProducer(config).getInstance();
    },
  };
}
