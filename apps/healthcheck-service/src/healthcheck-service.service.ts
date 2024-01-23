import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Observable, lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

import { TelegramBot } from '@libs/transport-telegram';
import { LOGGER_SERVICE_DI, LoggerService } from '@libs/logger';
import { findByName, httpServiceErrorPipe } from '@libs/utils';
import { ConfigService } from '@libs/config';

import { urls } from './config';

@Injectable()
export class HealthcheckServiceService {
  admins: string[];

  constructor(
    @Inject(LOGGER_SERVICE_DI) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.admins = findByName(
      this.configService.get('bot'),
      'healthcheck-service',
    ).admin;
  }

  private async sendMessage(userId: string, text: string): Promise<any> {
    this.logger.info(`[sendMessage] text to user ${userId}`);

    const res = await TelegramBot.getInstance(
      'healthcheck-service',
    ).telegram.sendMessage(userId, text);

    return res;
  }

  private async checkUrl(url): Promise<any> {
    const observe: Observable<AxiosResponse> = this.httpService.get(url).pipe(
      ...httpServiceErrorPipe({
        logger: this.logger,
        message: `GET /healthcheck (${url})`,
      }),
    );
    const response = await lastValueFrom(observe);
    return response.data;
  }

  private async checkUrls(): Promise<any[]> {
    // this.logger.debug(`Check urls: ${JSON.stringify(urls)}`);

    const res = await Promise.all(urls.map(this.checkUrl.bind(this))).catch(
      (e) => {
        this.admins.forEach((admin) => this.sendMessage(admin, e));
        return e;
      },
    );
    return res;
  }

  @Cron('*/60 * * * * *')
  handleCron() {
    this.logger.debug('Start cron');
    return this.checkUrls();
  }

  check(): Promise<any> {
    return this.checkUrls();
  }
}
