import { Controller, Get } from '@nestjs/common';
import { HealthcheckServiceService } from './healthcheck-service.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Context } from 'telegraf';

@Controller()
export class HealthcheckServiceController {
  constructor(
    private readonly healthcheckServiceService: HealthcheckServiceService,
  ) {}

  @MessagePattern({ event: 'command', value: 'healthcheck' })
  healthcheck(@Payload() ctx: Context) {
    return ctx.reply('healthcheck - ok');
  }

  @MessagePattern({ event: 'command', value: 'chatId' })
  chatId(@Payload() ctx: Context) {
    return ctx.reply(String(ctx.chat.id));
  }

  @Get()
  check(): Promise<any> {
    return this.healthcheckServiceService.check();
  }
}
