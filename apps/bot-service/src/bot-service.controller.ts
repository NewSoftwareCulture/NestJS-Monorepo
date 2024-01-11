import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { BotService } from './bot-service.service';
import { delay } from '@libs/utils';
import { LoggerService } from '@libs/logger';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Context, Input } from 'telegraf';
import { TelegramAdminGuard } from '@libs/guards';

const adminIds = [];

@Controller()
export class BotController {
  constructor(
    private readonly botService: BotService,
    private readonly logger: LoggerService,
  ) {}

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
