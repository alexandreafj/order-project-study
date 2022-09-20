import { Test, TestingModule } from '@nestjs/testing';
import { ItemDto } from '../dto/Item-dto';
import { ItemService } from '../service/item.service';
import { ItemController } from './item.controller';
import { ItemTypes } from '../class/item-types';
import { ItemFilters } from '../class/item-filters';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemDeleteDto } from '../dto/item-delete-dto';

const mockItemServiceMethods = {
  selectItems: jest.fn(() => Promise.resolve([new ItemDto(), new ItemDto()])),
  insertItem: jest.fn(() => Promise.resolve([])),
  deleteItem: jest.fn(() => Promise.resolve()),
  updateItem: jest.fn(() => Promise.resolve()),
};

describe('ItemController', () => {
  let controller: ItemController;
  let spyService: ItemService;
  let spyLoggerService: LoggerWinstonService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ItemService,
      useFactory: () => mockItemServiceMethods,
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [ItemService, ApiServiceProvider, LoggerWinstonService],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    spyService = module.get<ItemService>(ItemService);
    spyLoggerService = module.get<LoggerWinstonService>(LoggerWinstonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyService).toBeDefined();
    expect(spyLoggerService).toBeDefined();
  });

  it('should create item', async () => {
    const createItemDto = new ItemDto();
    await controller.createItem(createItemDto);
    expect(spyService.insertItem).toBeCalledTimes(1);
    expect(spyService.insertItem).toHaveBeenCalledWith(createItemDto);
  });

  it('should get item', async () => {
    const itemFilters = new ItemFilters();
    itemFilters.limit = 100;
    itemFilters.offset = 0;
    itemFilters.name = 'test';
    itemFilters.price = 10;
    itemFilters.type = ItemTypes.Eletronic;
    const response = await controller.getItem(itemFilters);
    expect(spyService.selectItems).toBeCalledTimes(1);
    expect(spyService.selectItems).toHaveBeenCalledWith(itemFilters);
    expect(response.length).toBe(2);
    expect(response).toBeInstanceOf(Array);
  });

  it('should update item', async () => {
    const updateItemDto = new ItemDto();
    await controller.updateItem(updateItemDto);
    expect(spyService.updateItem).toBeCalledTimes(1);
    expect(spyService.updateItem).toHaveBeenCalledWith(updateItemDto);
  });

  it('should delete item', async () => {
    const itemDeleteDto = new ItemDeleteDto();
    itemDeleteDto.ids = [0];
    await controller.deleteItem(itemDeleteDto);
    expect(spyService.deleteItem).toBeCalledTimes(1);
    expect(spyService.deleteItem).toHaveBeenCalledWith(itemDeleteDto);
  });
});
