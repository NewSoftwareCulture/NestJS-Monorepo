import { Controller, Get, Query } from '@nestjs/common';
import { BotService } from './bot-service.service';
import { delay } from '@libs/utils';
import { LoggerService } from '@libs/logger';

@Controller()
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly logger: LoggerService,
  ) {}

  @Get()
  async getHello(
    @Query('ms') ms: number,
    @Query('client') client: number,
  ): Promise<any> {
    this.logger.warn('!!!!!!!!!!!!!');

    await delay(ms);
    return {
      status: 'ok',
      client,
      ms,
    };
  }
}
