import { Test, TestingModule } from '@nestjs/testing';
import { LoggerWinstonService } from './logger-winston.service';

describe('ItemService', () => {
  let service: LoggerWinstonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerWinstonService],
    }).compile();

    service = module.get<LoggerWinstonService>(LoggerWinstonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.log).toBeDefined();
  });
});
