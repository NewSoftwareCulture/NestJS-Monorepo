import { Test, TestingModule } from '@nestjs/testing';
import { BotController } from './bot-service.controller';
import { BotService } from './bot-service.service';

describe('BotController', () => {
  let appController: BotController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BotController],
      providers: [BotService],
    }).compile();

    appController = app.get<BotController>(BotController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
