import { UseGuards, applyDecorators } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

import { KafkaPatternOptions } from '../dto/kafka-decorator.dto';
import { MessageGuard } from '../guards';
import { TransportType } from '../constants';

export function KafkaMessageEventPattern(options: KafkaPatternOptions) {
  const { topic, consumer } = options;
  const params = {
    topic,
    consumer,
    type: TransportType.MESSAGE,
    id: uuidv4(),
  };

  return applyDecorators(UseGuards(MessageGuard), EventPattern(params));
}

export function KafkaMessageMessagePattern(options: KafkaPatternOptions) {
  const { topic, consumer } = options;
  const params = {
    topic,
    consumer,
    type: TransportType.MESSAGE,
    id: uuidv4(),
  };

  return applyDecorators(UseGuards(MessageGuard), MessagePattern(params));
}
