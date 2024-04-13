import { Inject, Injectable } from '@nestjs/common';
import { Context } from 'telegraf';

import { ConfigService } from '@libs/config';
import { LOGGER_SERVICE, LoggerService } from '@libs/logger';
import { TelegramBot } from '@libs/transport-telegram';

@Injectable()
export class BotTelegramService {
  constructor(
    @Inject(LOGGER_SERVICE) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(userId: string, text: string): Promise<any> {
    this.logger.info(`[sendMessage] "${text}" to user "${userId}"`);
    const res = await TelegramBot.getInstance(
      'bot-service',
    ).telegram.sendMessage(userId, text);

    return res;
  }

  info(ctx: Context) {
    const {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      username,
      language_code: lang,
    } = ctx.from || {};
    const { id: chatId, type: chatType } = ctx.chat || {};

    return `
ℹ️ <b>Info:</b>

-------- User --------

Id: ${userId}
Username: ${username}

Name: ${firstName || ''} ${lastName || ''}
Lang: ${lang}

------- Chat --------

Id: ${chatId}
Type: ${chatType}
`;
  }
}
