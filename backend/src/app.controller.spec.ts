import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHealth', () => {
    it('should return "OK" or "OK <timestamp>"', () => {
      jest.spyOn(appService, 'getHealth').mockReturnValueOnce('OK');
      expect(appController.getHealth()).toBe('OK');
    });

    it('should return a string containing "OK" and a timestamp', () => {
      const timestamp = new Date().toISOString();
      jest.spyOn(appService, 'getHealth').mockReturnValueOnce(`OK ${timestamp}`);
      const result = appController.getHealth();
      expect(result).toMatch(/^OK \d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*Z$/);
    });
  });
});
