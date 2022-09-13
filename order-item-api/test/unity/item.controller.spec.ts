import { Test, TestingModule } from '@nestjs/testing';
import { CreateItemDto } from '../../src/item/dto/createItem.dto';
import { ItemService } from '../../src/item/service/item.service';
import { ItemController } from '../../src/item/controller/item.controller';
import { ItemTypes } from '../../src/item/class/item-types';
import { ItemFilters } from '../../src/item/class/item-filters';

const mockItemServiceMethods = {
  selectItems: jest.fn(() => Promise.resolve([])),
  insertItem: jest.fn(() => Promise.resolve([])),
  deleteItem: jest.fn(() => Promise.resolve()),
  updateItem: jest.fn(() => Promise.resolve()),
};

describe('ItemController', () => {
  let controller: ItemController;
  let spyService: ItemService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: ItemService,
      useFactory: () => mockItemServiceMethods,
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [ItemService, ApiServiceProvider],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    spyService = module.get<ItemService>(ItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(spyService).toBeDefined();
    expect(controller.createItem).toBeDefined();
    expect(controller.updateItem).toBeDefined();
    expect(controller.getItem).toBeDefined();
    expect(controller.deleteItem).toBeDefined();
    expect(spyService.selectItems).toBeDefined();
    expect(spyService.insertItem).toBeDefined();
    expect(spyService.deleteItem).toBeDefined();
    expect(spyService.updateItem).toBeDefined();
  });

  it('should create item', async () => {
    const createItemDto = new CreateItemDto();
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
    await controller.getItem(itemFilters);
    expect(spyService.selectItems).toBeCalledTimes(1);
    expect(spyService.selectItems).toHaveBeenCalledWith(itemFilters);
  });

  it('should update item', async () => {
    const createItemDto = new CreateItemDto();
    await controller.createItem(createItemDto);
    expect(spyService.insertItem).toBeCalledTimes(1);
    expect(spyService.insertItem).toHaveBeenCalledWith(createItemDto);
  });

  // it('should delete item', async () => {
  //   const createItemDto = new CreateItemDto();
  //   await controller.createItem(createItemDto);
  //   expect(spyService.insertItem).toBeCalledTimes(1);
  //   expect(spyService.insertItem).toHaveBeenCalledWith(createItemDto);
  // });
});
