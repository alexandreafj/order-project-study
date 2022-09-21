import { Test, TestingModule } from '@nestjs/testing';
import { ItemDto } from '../dto/Item-dto';
import { ItemService } from '../service/item.service';
import { ItemController } from './item.controller';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemDeleteDto } from '../dto/item-delete-dto';
import { CacheService } from '../../common/helpers/service/cache.service';
import { mockItemsFilters } from '../../../test/helpers/mock-item-helpers';

const mockItemFilters = mockItemsFilters();

const mockKeyPatten = 'select:item';

const mockItemServiceMethods = {
  selectItems: jest.fn(() => Promise.resolve([new ItemDto(), new ItemDto()])),
  insertItem: jest.fn(() => Promise.resolve([])),
  deleteItem: jest.fn(() => Promise.resolve()),
  updateItem: jest.fn(() => Promise.resolve()),
};

const mockCacheServiceMethods = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

describe('ItemController', () => {
  let controller: ItemController;
  let itemService: ItemService;
  let spyLoggerService: LoggerWinstonService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ItemService,
      useFactory: () => mockItemServiceMethods,
    };
    const cacheServiceProvider = {
      provide: CacheService,
      useFactory: () => mockCacheServiceMethods,
    }
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [ItemService, ApiServiceProvider, LoggerWinstonService, cacheServiceProvider],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    itemService = module.get<ItemService>(ItemService);
    spyLoggerService = module.get<LoggerWinstonService>(LoggerWinstonService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(itemService).toBeDefined();
    expect(spyLoggerService).toBeDefined();
    expect(cacheService).toBeDefined();
  });

  it('should create item', async () => {
    const createItemDto = new ItemDto();
    const spyDel = jest.spyOn(cacheService, 'del').mockImplementation(() => Promise.resolve());
    await controller.createItem(createItemDto);
    expect(spyDel).toBeCalledTimes(1);
    expect(spyDel).toHaveBeenCalledWith(mockKeyPatten);
    expect(itemService.insertItem).toBeCalledTimes(1);
    expect(itemService.insertItem).toHaveBeenCalledWith(createItemDto);
  });

  it('should get item', async () => {
    const mockKey = `select:item:${JSON.stringify(mockItemFilters)}`;
    const spyGet = jest.spyOn(cacheService, 'get').mockImplementation(() => Promise.resolve(null));
    const spySet = jest.spyOn(cacheService, 'set').mockImplementation(() => Promise.resolve('OK'));
    const response = await controller.getItem(mockItemFilters);
    expect(itemService.selectItems).toBeCalledTimes(1);
    expect(itemService.selectItems).toHaveBeenCalledWith(mockItemFilters);
    expect(response.length).toBe(2);
    expect(response).toBeInstanceOf(Array);
    expect(spyGet).toBeCalledTimes(1);
    expect(spyGet).toBeCalledWith(mockKey);
    expect(spySet).toBeCalledTimes(1);
    expect(spySet).toBeCalledWith(mockKey, response);
  });

  it('should update item', async () => {
    const updateItemDto = new ItemDto();
    const spyDel = jest.spyOn(cacheService, 'del').mockImplementation(() => Promise.resolve());
    await controller.updateItem(updateItemDto);
    expect(spyDel).toBeCalledTimes(1);
    expect(spyDel).toHaveBeenCalledWith(mockKeyPatten);
    expect(itemService.updateItem).toBeCalledTimes(1);
    expect(itemService.updateItem).toHaveBeenCalledWith(updateItemDto);
  });

  it('should delete item', async () => {
    const itemDeleteDto = new ItemDeleteDto();
    itemDeleteDto.ids = [0];
    const spyDel = jest.spyOn(cacheService, 'del').mockImplementation(() => Promise.resolve());
    await controller.deleteItem(itemDeleteDto);
    expect(spyDel).toBeCalledTimes(1);
    expect(spyDel).toHaveBeenCalledWith(mockKeyPatten)
    expect(itemService.deleteItem).toBeCalledTimes(1);
    expect(itemService.deleteItem).toHaveBeenCalledWith(itemDeleteDto);
  });


  it('should get item from cache', async () => {
    const mockKey = `select:item:${JSON.stringify(mockItemFilters)}`;
    const spyGet = jest.spyOn(cacheService, 'get').mockImplementation(() => Promise.resolve('[{"id":0,"name":"test","description":"test","price":10,"discount":0,"type":"eletronic"}]'));
    const response = await controller.getItem(mockItemFilters);
    expect(itemService.selectItems).toBeCalledTimes(0);
    expect(response.length).toBe(1);
    expect(response).toBeInstanceOf(Array);
    expect(spyGet).toBeCalledTimes(1);
    expect(spyGet).toBeCalledWith(mockKey);
  });
});