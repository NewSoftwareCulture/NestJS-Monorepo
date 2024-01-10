import { Injectable } from '@nestjs/common';
import { Context, Telegraf } from 'telegraf';
import { ConfigService } from '@libs/config';

@Injectable()
export class BotService {
  constructor(private readonly configService: ConfigService) {}

  private bot: Telegraf;

  async onModuleInit() {
    const token = this.configService.get('bot_token');
    this.bot = new Telegraf(token);

    this.bot.catch(this.errorCatcher);

    this.run();

    this.bot.launch();
  }

  private run() {
    // TODO: scene + load video + load photo
    this.bot.hears('hi', (ctx) => {
      return ctx.reply('hello!');
    });
  }

  private errorCatcher(err: Error, ctx: Context) {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  }
}
