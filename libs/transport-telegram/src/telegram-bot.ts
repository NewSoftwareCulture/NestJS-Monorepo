import { Telegraf } from 'telegraf';

import { BotConfig } from '@libs/config/dto/bot.dto';

type Instance = {
  [key: string]: TelegramBot;
};

export class TelegramBot {
  private static instance: Instance = {};
  private client: Telegraf;
  private config: BotConfig;

  constructor(config: BotConfig) {
    this.client = new Telegraf(config.token);
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

  static create(config: BotConfig) {
    const { name } = config;

    if (!this.instance[name]) {
      this.instance[name] = new TelegramBot(config);
    }
    return this.instance[name];
  }
}
