import { Telegraf } from 'telegraf';

import { BotDto } from '@libs/config/dto/bot.dto';

type Instance = {
  [key: string]: TelegramBot;
};

export class TelegramBot {
  private static instance: Instance = {};
  private client: Telegraf;
  private config: BotDto;

  constructor(config: BotDto) {
    this.client = new Telegraf(config.token, {
      telegram: {
        apiRoot: config.apiRoot,
      },
    });
    this.config = config;
  }

  getClient() {
    return this.client;
  }

  static getInstance(name: string) {
    return this.instance[name].client;
  }

  static getInstances() {
    return this.instance;
  }

  static create(config: BotDto) {
    const { name } = config;

    if (!this.instance[name]) {
      this.instance[name] = new TelegramBot(config);
    }
    return this.instance[name];
  }
}
