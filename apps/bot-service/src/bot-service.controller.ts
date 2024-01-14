import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Context, Input } from 'telegraf';

import { LoggerService } from '@libs/logger';
import { ConfigService } from '@libs/config';
import { TelegramAdminGuard } from '@libs/guards';
import { delay, findByName } from '@libs/utils';

import { BotService } from './bot-service.service';

const adminIds: number[] = [];

@Controller()
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    adminIds.push(
      ...findByName(this.configService.get('bot'), 'bot-service').admin,
    );
  }

  @MessagePattern({ event: 'sticker' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  sticker(@Payload() ctx: Context) {
    return ctx.reply('Its sticker!');
  }

  @MessagePattern({ event: 'hears', value: 'hello' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  hears(@Payload() ctx: Context) {
    return ctx.reply('Its text "hello"!');
  }

  @MessagePattern({ event: 'command', value: 'info' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  info(@Payload() ctx: Context) {
    const {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      username,
      language_code: lang,
    } = ctx.from || {};
    const { id: chatId, type: chatType } = ctx.chat || {};

    const msg = `
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
    return ctx.replyWithHTML(msg);
  }

  @MessagePattern({ event: 'command', value: 'help' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  command(@Payload() ctx: Context) {
    return ctx.reply('Its command "help"!');
  }

  @MessagePattern({ event: 'video' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  video(@Payload() ctx: Context) {
    return ctx.reply('Its video!');
  }

  @MessagePattern({ event: 'document' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  document(@Payload() ctx: Context) {
    console.log(ctx);
    console.log(ctx.update);
    return ctx.reply('Its document!');
  }

  @MessagePattern({ event: 'photo' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  async photo(@Payload() ctx: Context) {
    await ctx.reply('Its photo!');
    return ctx.replyWithPhoto(Input.fromLocalFile('./assets/telegram.webp'));
  }

  @MessagePattern({ event: 'message' })
  @UseGuards(new TelegramAdminGuard(adminIds))
  message(@Payload() ctx: Context) {
    return ctx.reply('Its unexpected message!');
  }

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
