import { ConfigModule, ConfigService } from '@libs/config';

type JSON = {
  [key: string]: any;
};

export type RegisterAsyncOptions = {
  imports: [typeof ConfigModule];
  inject: [typeof ConfigService];
  useFactory(options: any): JSON;
};
