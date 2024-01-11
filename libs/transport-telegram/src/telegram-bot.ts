import { Telegraf } from 'telegraf';

export class TelegramBot {
  private static instance: TelegramBot;
  private client: Telegraf;

  constructor(token: string) {
    this.client = new Telegraf(token);
  }

  getClient() {
    return this.client;
  }

  static getInstance() {
    return this.instance.client;
  }

  static create(token: string) {
    if (!this.instance) {
      this.instance = new TelegramBot(token);
    }
    return this.instance;
  }
}
