import { Controller, UseInterceptors } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { ConfigService } from '@libs/config';

import { BotRabbitService } from '../services/bot-worker-rabbit.service';
import { RabbitMQInterceptor } from 'libs/transport-rabbitmq/src';

@Controller()
export class BotRabbitController {
  constructor(
    private readonly botService: BotRabbitService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern('ping')
  @UseInterceptors(RabbitMQInterceptor)
  ping(@Payload() payload: any) {
    return this.botService.pong(payload);
  }
}
