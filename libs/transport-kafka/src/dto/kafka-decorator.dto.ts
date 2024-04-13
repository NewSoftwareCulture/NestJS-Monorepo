import { ConsumerConfig } from 'kafkajs';

export type KafkaPatternOptions = {
  topic: string;
  consumer: ConsumerConfig;
};
