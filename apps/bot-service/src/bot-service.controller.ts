import { Controller, Get, Query } from '@nestjs/common';
import { BotService } from './bot-service.service';
import { delay } from '@libs/utils';

@Controller()
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Get()
  async getHello(
    @Query('ms') ms: number,
    @Query('client') client: number,
  ): Promise<any> {
    await delay(ms);
    return {
      status: 'ok',
      client,
      ms,
    };
  }
}
