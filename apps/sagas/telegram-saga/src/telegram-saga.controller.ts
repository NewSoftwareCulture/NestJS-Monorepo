import { EventPattern, Payload } from '@nestjs/microservices';
import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';

import { RabbitMQInterceptor } from '@libs/transport-rabbitmq';
import { healthcheck } from '@libs/healthcheck/healthcheck';

import { TelegramSagaService } from './telegram-saga.service';

@Controller()
export class TelegramSagaController {
  constructor(private readonly telegramSagaService: TelegramSagaService) {}

  @Get('healthcheck')
  healthcheck(@Req() req: Request) {
    const { method, url } = req;
    const host = req.headers['host'];

    return healthcheck({ name: 'telegram-saga', host, req: { method, url } });
  }

  @EventPattern('base-flow')
  @UseInterceptors(RabbitMQInterceptor)
  async run(@Payload() payload: any): Promise<string> {
    return this.telegramSagaService.run(payload);
  }
}
