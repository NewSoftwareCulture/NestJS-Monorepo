import { Test, TestingModule } from '@nestjs/testing';
import { TelegramSagaController } from './telegram-saga.controller';
import { TelegramSagaService } from './telegram-saga.service';

describe('TelegramSagaController', () => {
  let telegramSagaController: TelegramSagaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TelegramSagaController],
      providers: [TelegramSagaService],
    }).compile();

    telegramSagaController = app.get<TelegramSagaController>(
      TelegramSagaController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(telegramSagaController.getHello()).toBe('Hello World!');
    });
  });
});
