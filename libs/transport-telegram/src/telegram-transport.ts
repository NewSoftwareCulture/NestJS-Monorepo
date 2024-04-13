import { CustomTransportStrategy, Server } from '@nestjs/microservices';
import { Context, Telegraf, session, Scenes } from 'telegraf';

import { BotDto } from '@libs/config/dto/bot.dto';

import { EventHandler, EventSceneHandler } from './telegram-transport.dto';
import { Transport, events, eventsScene } from './constants';
import { TelegramBot } from './telegram-bot';

type SceneStorage = {
  [key: string]: Scenes.BaseScene;
};

export class TelegramTransportStrategy
  extends Server
  implements CustomTransportStrategy
{
  private stage: Scenes.Stage<any>;
  private scenes: SceneStorage = {};
  private bot: Telegraf;
  private log: any;

  constructor(bot: BotDto, log: any) {
    super();

    this.createBot(bot);
    this.createLogger(log);
  }

  private createBot(bot: BotDto) {
    this.bot = TelegramBot.create(bot).getClient();

    this.stage = new Scenes.Stage();

    this.bot.use(session());
    this.bot.use(this.stage.middleware());
    this.bot.use(async (ctx: any, next) => {
      this.log.info(
        `[main] Message from ${ctx.from.username} (${ctx.from.id}): ${
          ctx?.update?.message?.text || ctx?.callback_query?.message?.text
        }`,
      );
      await next();
    });

    this.bot.catch(this.errorCatcher.bind(this));
  }

  private createLogger(log) {
    this.log = log;
  }

  private bindHandlers() {
    const eventHandlers: EventHandler[] | EventSceneHandler[] = Array.from(
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
      .filter(Boolean)
      .filter(({ event }) => event);

    const handlers = eventHandlers.filter(
      (eventHandler: any) => eventHandler.transport,
    );

    handlers
      .filter((eventHandler: any) => events.includes(eventHandler.event))
      .filter(({ transport }: EventHandler) => transport === Transport.TELEGRAM)
      .forEach((eventHandler: EventHandler) => {
        const { event, value } = eventHandler;

        const origKey = JSON.stringify(eventHandler);

        const handler = this.messageHandlers.get(origKey);

        const eventPatternHandler = (ctx) => handler(ctx);
        const messagePatternHandler = (ctx) =>
          handler(ctx).then((res) => ctx.replyWithHTML(res));

        const patternHandler = handler.isEventHandler
          ? eventPatternHandler
          : messagePatternHandler;

        if (event === 'hears') {
          this.bot.hears(value, patternHandler);
        } else if (event === 'command') {
          this.bot.command(value, patternHandler);
        } else {
          this.bot.on(event, patternHandler);
        }
      });

    handlers
      .filter((eventHandler: any) => eventsScene.includes(eventHandler.event))
      .filter(
        ({ transport }: EventSceneHandler) =>
          transport === Transport.TELEGRAM_SCENE,
      )
      .forEach((eventHandler: EventSceneHandler) => {
        const { event, scene, value } = eventHandler;

        const origKey = JSON.stringify(eventHandler);

        const handler = this.messageHandlers.get(origKey);

        const eventPatternHandler = (ctx, next?) => handler(ctx, next);
        const messagePatternHandler = (ctx, next?) =>
          handler(ctx, next).then((res) => ctx.replyWithHTML(res));

        if (!this.scenes[scene]) {
          this.scenes[scene] = new Scenes.BaseScene(scene);
          this.stage.register(this.scenes[scene]);
        }

        const patternHandler = handler.isEventHandler
          ? eventPatternHandler
          : messagePatternHandler;

        if (event === 'enter') {
          this.scenes[scene].enter((ctx: any) => {
            ctx.session.counter = 1;
            return patternHandler(ctx);
          });
        } else if (event === 'leave') {
          this.scenes[scene].leave((ctx: any) => {
            ctx.session.counter = 0;
            return patternHandler(ctx);
          });
        } else if (event === 'hears') {
          this.scenes[scene].hears(value, (ctx: any) => {
            ctx.session.counter += 1;
            return patternHandler(ctx);
          });
        } else if (event === 'command') {
          this.scenes[scene].command(value, (ctx: any) => {
            ctx.session.counter += 1;
            return patternHandler(ctx);
          });
        } else {
          this.scenes[scene].on(event, (ctx: any) => {
            ctx.session.counter += 1;
            return patternHandler(ctx);
          });
        }
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
