import { Test, TestingModule } from '@nestjs/testing';
import { ItemDto } from '../dto/Item-dto';
import { ItemService } from '../service/item.service';
import { ItemController } from './item.controller';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemDeleteDto } from '../dto/item-delete-dto';
import { CacheModule } from '../../common/helpers/cache/cache.module';
import { CacheMethodsToken } from '../../common/helpers/cache/cache.interface';
import { mockItemsFilters } from '../../../test/helpers/mock-item-helpers';
import { NotFoundException } from '@nestjs/common';

const mockItemFilters = mockItemsFilters();

const mockKeyPatten = 'select:item';

const mockItemServiceMethods = {
  selectItems: jest.fn(() => Promise.resolve([new ItemDto(), new ItemDto()])),
  insertItem: jest.fn(() => Promise.resolve([])),
  deleteItem: jest.fn(() => Promise.resolve()),
  updateItem: jest.fn(() => Promise.resolve()),
  existItem: jest.fn(() => Promise.resolve(false)),
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

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ItemService,
      useFactory: () => mockItemServiceMethods,
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ItemController],
      providers: [
        ItemService,
        ApiServiceProvider,
        LoggerWinstonService,
        CacheModule,
        { provide: CacheMethodsToken, useFactory: () => mockCacheServiceMethods }],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    itemService = module.get<ItemService>(ItemService);
    spyLoggerService = module.get<LoggerWinstonService>(LoggerWinstonService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(itemService).toBeDefined();
    expect(spyLoggerService).toBeDefined();
  });

  it('should create item', async () => {
    const createItemDto = new ItemDto();
    await controller.createItem(createItemDto);
    expect(mockCacheServiceMethods.del).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.del).toHaveBeenCalledWith(mockKeyPatten);
    expect(itemService.insertItem).toBeCalledTimes(1);
    expect(itemService.insertItem).toHaveBeenCalledWith(createItemDto);
  });

  it('should get item', async () => {
    const mockKey = `select:item:${JSON.stringify(mockItemFilters)}`;
    const response = await controller.getItem(mockItemFilters);
    expect(itemService.selectItems).toBeCalledTimes(1);
    expect(itemService.selectItems).toHaveBeenCalledWith(mockItemFilters);
    expect(response.length).toBe(2);
    expect(response).toBeInstanceOf(Array);
    expect(mockCacheServiceMethods.get).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.get).toBeCalledWith(mockKey);
    expect(mockCacheServiceMethods.set).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.set).toBeCalledWith(mockKey, response);
  });

  it('should update item', async () => {
    const updateItemDto = new ItemDto();
    await controller.updateItem(updateItemDto);
    expect(mockCacheServiceMethods.del).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.del).toHaveBeenCalledWith(mockKeyPatten);
    expect(itemService.updateItem).toBeCalledTimes(1);
    expect(itemService.updateItem).toHaveBeenCalledWith(updateItemDto);
  });

  it('should not update item', async () => {
    const updateItemDto = new ItemDto();
    const spyExists = jest.spyOn(mockItemServiceMethods, 'existItem').mockImplementation(() => Promise.resolve(true));
    await expect(controller.updateItem(updateItemDto)).rejects.toEqual(new NotFoundException('Item not found!'));
    expect(spyExists).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.del).toBeCalledTimes(0);
    expect(itemService.updateItem).toBeCalledTimes(0);
  });

  it('should delete item', async () => {
    const itemDeleteDto = new ItemDeleteDto();
    itemDeleteDto.ids = [0];
    await controller.deleteItem(itemDeleteDto);
    expect(mockCacheServiceMethods.del).toBeCalledTimes(1);
    expect(mockCacheServiceMethods.del).toHaveBeenCalledWith(mockKeyPatten)
    expect(itemService.deleteItem).toBeCalledTimes(1);
    expect(itemService.deleteItem).toHaveBeenCalledWith(itemDeleteDto);
  });


  it('should get item from cache', async () => {
    const mockKey = `select:item:${JSON.stringify(mockItemFilters)}`;
    const spyGet = jest.spyOn(mockCacheServiceMethods, 'get').mockImplementation(() => Promise.resolve('[{"id":0,"name":"test","description":"test","price":10,"discount":0,"type":"eletronic"}]'));
    const response = await controller.getItem(mockItemFilters);
    expect(itemService.selectItems).toBeCalledTimes(0);
    expect(response.length).toBe(1);
    expect(response).toBeInstanceOf(Array);
    expect(spyGet).toBeCalledTimes(1);
    expect(spyGet).toBeCalledWith(mockKey);
  });
});