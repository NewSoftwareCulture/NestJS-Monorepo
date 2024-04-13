import { Test, TestingModule } from '@nestjs/testing';
import { HealthcheckServiceController } from './healthcheck-service.controller';
import { HealthcheckServiceService } from './healthcheck-service.service';

describe('HealthcheckServiceController', () => {
  let healthcheckServiceController: HealthcheckServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthcheckServiceController],
      providers: [HealthcheckServiceService],
    }).compile();

    healthcheckServiceController = app.get<HealthcheckServiceController>(HealthcheckServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(healthcheckServiceController.getHello()).toBe('Hello World!');
    });
  });
});
