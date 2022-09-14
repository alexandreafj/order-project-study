import { Test, TestingModule } from '@nestjs/testing';
import { CreateItemDto } from '../../src/item/dto/createItem.dto';
import { ItemService } from '../../src/item/service/item.service';
import { ItemController } from '../../src/item/controller/item.controller';
import { ItemTypes } from '../../src/item/class/item-types';
import { ItemFilters } from '../../src/item/class/item-filters';
import { UpdateItemDto } from '../../src/item/dto/update-item.dto';
import { Item } from '../../src/item/class/Item';
import { DeleteItemDto } from '../../src/item/dto/delete-item.dto';
import { LoggerWinstonService } from '../../src/common/helpers/service/logger-winston.service';

const mockItemServiceMethods = {
  selectItems: jest.fn(() => Promise.resolve([new Item(), new Item()])),
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
    expect(controller.createItem).toBeDefined();
    expect(controller.updateItem).toBeDefined();
    expect(controller.getItem).toBeDefined();
    expect(controller.deleteItem).toBeDefined();

    expect(spyService).toBeDefined();
    expect(spyService.selectItems).toBeDefined();
    expect(spyService.insertItem).toBeDefined();
    expect(spyService.deleteItem).toBeDefined();
    expect(spyService.updateItem).toBeDefined();

    expect(spyLoggerService).toBeDefined();
    expect(spyLoggerService.log).toBeDefined();
  });

  it('should create item', async () => {
    const createItemDto = new CreateItemDto();
    await controller.createItem(createItemDto);
    expect(spyService.insertItem).toBeCalledTimes(1);
    expect(spyService.insertItem).toHaveBeenCalledWith(createItemDto);
  });

  // it('should throw internal server error if something unexpected happens when create item', async () => {
  //   const createItemDto = new CreateItemDto();
  //   await expect(controller.createItem(createItemDto)).toThrow()
  //   expect(spyService.insertItem).toBeCalledTimes(0);
  // });

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

  // it('should throw internal server error if something unexpected happens when getting items', async () => {
  //   const itemFilters = new ItemFilters();
  //   itemFilters.limit = 100;
  //   itemFilters.offset = 0;
  //   itemFilters.name = 'test';
  //   itemFilters.price = 10;
  //   itemFilters.type = ItemTypes.Eletronic;
  //   await expect(controller.getItem(itemFilters)).rejects.toEqual('try again later');
  // });

  it('should update item', async () => {
    const updateItemDto = new UpdateItemDto();
    await controller.updateItem(updateItemDto);
    expect(spyService.updateItem).toBeCalledTimes(1);
    expect(spyService.updateItem).toHaveBeenCalledWith(updateItemDto);
  });

  it('should delete item', async () => {
    const delteItemDto = new DeleteItemDto();
    const arrayDeleteItemsDto = [delteItemDto];
    await controller.deleteItem(arrayDeleteItemsDto);
    expect(spyService.deleteItem).toBeCalledTimes(1);
    expect(spyService.deleteItem).toHaveBeenCalledWith(arrayDeleteItemsDto);
  });
});
