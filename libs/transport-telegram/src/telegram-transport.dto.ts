import { MessageSubType, UpdateType } from 'telegraf/typings/telegram-types';
import { Transport } from './constants';

type _EventType = UpdateType | MessageSubType | 'command' | 'hears';

export type EventType = _EventType;
export type EventSceneType = EventType | 'enter' | 'leave';

export type EventHandler = {
  event: EventType;
  value?: string;
  transport: typeof Transport.TELEGRAM;
};

export type EventSceneHandler = {
  event: EventSceneType;
  scene: string;
  value?: string;
  transport: typeof Transport.TELEGRAM_SCENE;
};
