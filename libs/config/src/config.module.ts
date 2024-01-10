import { Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { getConfig } from './config';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory() {
        return new ConfigService(getConfig());
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
