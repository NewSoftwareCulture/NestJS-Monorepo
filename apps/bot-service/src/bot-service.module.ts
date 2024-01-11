import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@libs/config';
import { LoggerModule } from '@libs/logger';

import { BotController } from './bot-service.controller';
import { BotService } from './bot-service.service';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          logger: configService.get('logger'),
        };
      },
    }),
  ],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
