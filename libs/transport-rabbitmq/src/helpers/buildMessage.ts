import { RmqRecordBuilder, RmqRecordOptions } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

const defaultOptions = {
  persistent: true,
  messageId: randomUUID(),
  timestamp: Date.now(),
  expiration: 24 * 60 * 60 * 1000,
  priority: 5,
};

export const buildMessage = (message, options: RmqRecordOptions = {}) =>
  new RmqRecordBuilder(message)
    .setOptions({
      ...defaultOptions,
      ...options,
    })
    .build();
