import { Module } from '@nestjs/common';
import { ConfigModule } from '@libs/config';

import { BotController } from './bot-service.controller';
import { BotService } from './bot-service.service';

@Module({
  imports: [ConfigModule],
  controllers: [BotController],
  providers: [BotService],
})
export class BotModule {}
