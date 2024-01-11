import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Context, Telegraf } from 'telegraf';

import { EventHandler, events } from './telegram-transport.dto';
import { TelegramBot } from './telegram-bot';

export class TelegramTransportStrategy
  extends Server
  implements CustomTransportStrategy
{
  private bot: Telegraf;
  private log: any;

  constructor(token: string, log: any) {
    super();

    this.createBot(token);
    this.createLogger(log);
  }

  private createBot(token: string) {
    this.bot = TelegramBot.create(token).getClient();

    this.bot.catch(this.errorCatcher);
  }

  private createLogger(log) {
    this.log = log;
  }

  private bindHandlers() {
    const eventHandlers: EventHandler[] = Array.from(
      this.messageHandlers.keys(),
    )
      .map((handler) => {
        try {
          const res = JSON.parse(handler);
          return res;
        } catch (error) {
          return handler;
        }
      })
      .filter(({ event }) => event);

    eventHandlers.forEach((eventHandler: EventHandler) => {
      const { event, value } = eventHandler;

      if (!events.includes(event)) return;

      const origKey = JSON.stringify(eventHandler);

      const handler = this.messageHandlers.get(origKey);

      if (event === 'hears') this.bot.hears(value, handler.bind(this));
      else if (event === 'command') this.bot.command(value, handler.bind(this));
      else this.bot.on(event, handler.bind(this));
    });
  }

  private errorCatcher(err: Error, ctx: Context) {
    this.log.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
  }

  /**
   * This method is triggered when you run "app.listen()".
   */
  listen(callback: () => void) {
    this.bindHandlers();

    this.bot.launch();
    callback();
  }

  /**
   * This method is triggered on application shutdown.
   */
  async close() {
    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }
}
