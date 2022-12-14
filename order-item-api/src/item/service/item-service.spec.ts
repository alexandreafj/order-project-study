import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemRepository } from '../../repository/item.repository';
import { ItemService } from './item.service';
import { ItemDto } from '../dto/Item-dto';
import { ItemTypes } from '../class/item-types';
import { ItemMap } from '../class/item-map';
import { Item } from '../../entitys/item.entity';
import { Repository } from 'typeorm';
import { ItemDeleteDto } from '../dto/item-delete-dto';
import { NotFoundException } from '@nestjs/common';
import { mockItemsFilters } from '../../../test/helpers/mock-item-helpers';

const mockItemFilters = mockItemsFilters();

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService, LoggerWinstonService, ItemRepository, { provide: getRepositoryToken(Item), useClass: Repository }],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get(ItemRepository);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(itemRepository).toBeDefined();
  });

  it('should create item', async () => {
    const mockItemDto: ItemDto = {
      name: 'teste',
      description: 'description teste',
      discount: 0,
      price: 10,
      type: ItemTypes.Eletronic,
    };
    const mockItemEntity = ItemMap.toEntity(mockItemDto);
    const spySave = jest.spyOn(itemRepository, 'save').mockImplementation(() => Promise.resolve());
    await service.insertItem(mockItemDto);
    expect(spySave).toBeCalledTimes(1);
    expect(spySave).toBeCalledWith(mockItemEntity);
  });
  it('should delete item', async () => {
    const itemDeleteDto = new ItemDeleteDto();
    itemDeleteDto.ids = [1];
    const spyDelete = jest.spyOn(itemRepository, 'delete').mockImplementation(() => Promise.resolve());
    await service.deleteItem(itemDeleteDto);
    expect(spyDelete).toBeCalledTimes(1);
    expect(spyDelete).toBeCalledWith(itemDeleteDto);
  });
  it('should update item', async () => {
    const mockItemUpdateDto = new ItemDto();
    mockItemUpdateDto.name = 'mock';
    mockItemUpdateDto.description = 'teste';
    mockItemUpdateDto.discount = 0;
    mockItemUpdateDto.price = 100;
    mockItemUpdateDto.type = ItemTypes.Eletronic;
    const mockItemUpdate = ItemMap.toEntity(mockItemUpdateDto);
    const spyUpdate = jest.spyOn(itemRepository, 'update').mockImplementation(() => Promise.resolve());
    const spyExists = jest.spyOn(itemRepository, 'exists').mockImplementation(() => Promise.resolve(true));
    await service.updateItem(mockItemUpdateDto);
    expect(spyUpdate).toBeCalledTimes(1);
    expect(spyUpdate).toBeCalledWith(mockItemUpdate);
    expect(spyExists).toBeCalledTimes(1);
    expect(spyExists).toBeCalledWith(mockItemUpdate);
  })
  it('should throw error when user is not found on trying to update', async () => {
    const mockItemUpdateDto = new ItemDto();
    mockItemUpdateDto.name = 'mock';
    mockItemUpdateDto.description = 'teste';
    mockItemUpdateDto.discount = 0;
    mockItemUpdateDto.price = 100;
    mockItemUpdateDto.type = ItemTypes.Eletronic;
    const mockItemUpdate = ItemMap.toEntity(mockItemUpdateDto);
    const spyExists = jest.spyOn(itemRepository, 'exists').mockImplementation(() => Promise.resolve(false));
    await expect(service.updateItem(mockItemUpdateDto)).rejects.toEqual(new NotFoundException('Item not found!'));
    expect(spyExists).toBeCalledTimes(1);
    expect(spyExists).toBeCalledWith(mockItemUpdate);
  })
  it('should return at least one item', async () => {
    const spySelect = jest.spyOn(itemRepository, 'select').mockImplementation(() => Promise.resolve([new Item()]));
    const response = await service.selectItems(mockItemFilters);
    expect(spySelect).toBeCalledTimes(1);
    expect(spySelect).toBeCalledWith(mockItemFilters);
    expect(response.length).toBe(1);
  })

  it('should return zero selected items', async () => {
    const spySelect = jest.spyOn(itemRepository, 'select').mockImplementation(() => Promise.resolve(undefined));
    const response = await service.selectItems(mockItemFilters);
    expect(spySelect).toBeCalledTimes(1);
    expect(spySelect).toBeCalledWith(mockItemFilters);
    expect(response.length).toBe(0);
  })
});
