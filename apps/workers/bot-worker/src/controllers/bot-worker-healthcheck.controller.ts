import { Controller, Get, Inject, Query, Req } from '@nestjs/common';

import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { ConfigService } from '@libs/config';
import { healthcheck } from '@libs/healthcheck';
import { delay } from '@libs/utils';

@Controller()
export class BotHealthcheckController {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @Get('healthcheck')
  healthcheck(@Req() req: Request) {
    const { method, url } = req;
    const host = req.headers['host'];

    return healthcheck({ name: 'bot-service', host, req: { method, url } });
  }

  // test multi-request response
  @Get()
  async getHello(
    @Query('ms') ms?: number,
    @Query('client') client?: number,
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
