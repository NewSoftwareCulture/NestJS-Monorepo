import { KafkaDto } from '@libs/config/dto/kafka.dto';
import { Kafka } from 'kafkajs';

export class KafkaClient {
  private static instance: KafkaClient;
  private instance: Kafka;

  static create(config: KafkaDto) {
    if (!this.instance) {
      this.instance = new KafkaClient(config);
    }

    return this.instance;
  }

  constructor(config: KafkaDto) {
    const { clientId, host, port } = config;

    this.instance = new Kafka({
      clientId,
      brokers: [`${host}:${port}`],
    });
  }

  getInstance() {
    return this.instance;
  }
}
