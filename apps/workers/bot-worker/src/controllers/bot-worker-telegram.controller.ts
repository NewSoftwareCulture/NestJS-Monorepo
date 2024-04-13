import { Controller, SetMetadata, UseGuards } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { Context, Input } from 'telegraf';

import { ConfigService } from '@libs/config';
import { TelegramAdminGuard } from '@libs/guards';

import { BotTelegramService } from '../services/bot-worker-telegram.service';
import { Transport as TelegramTransport } from '@libs/transport-telegram';

const admins: string[] = [];

@Controller()
export class BotTelegramController {
  constructor(
    private readonly botService: BotTelegramService,
    private readonly configService: ConfigService,
  ) {}

  @EventPattern({ event: 'sticker', transport: TelegramTransport.TELEGRAM })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  sticker(@Payload() ctx: Context) {
    return ctx.reply('Its sticker!');
  }

  @EventPattern({
    event: 'hears',
    value: 'hello',
    transport: TelegramTransport.TELEGRAM,
  })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  hears(@Payload() ctx: Context) {
    return ctx.reply('Its text "hello"!');
  }

  @MessagePattern({
    event: 'command',
    value: 'info',
    transport: TelegramTransport.TELEGRAM,
  })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  info(@Payload() ctx: Context) {
    return this.botService.info(ctx);
  }

  @EventPattern({
    event: 'command',
    value: 'help',
    transport: TelegramTransport.TELEGRAM,
  })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  command(@Payload() ctx: Context) {
    return ctx.reply('Its command "help"!');
  }

  @EventPattern({ event: 'video', transport: TelegramTransport.TELEGRAM })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  video(@Payload() ctx: Context) {
    return ctx.reply('Its video!');
  }

  @EventPattern({ event: 'document', transport: TelegramTransport.TELEGRAM })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  document(@Payload() ctx: Context) {
    return ctx.reply('Its document!');
  }

  @EventPattern({ event: 'photo', transport: TelegramTransport.TELEGRAM })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  async photo(@Payload() ctx: Context) {
    await ctx.reply('Its photo!');
    return ctx.replyWithPhoto(Input.fromLocalFile('./assets/telegram.webp'));
  }

  @MessagePattern({ event: 'message', transport: TelegramTransport.TELEGRAM })
  @SetMetadata('admins', admins)
  @UseGuards(TelegramAdminGuard)
  message() {
    return 'Its unexpected message!';
  }
}
