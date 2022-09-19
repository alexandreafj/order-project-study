import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemRepository } from '../../repository/item.repository';
import { ItemService } from './item.service';
import { Repository } from 'typeorm';
import { ItemDto } from '../dto/Item-dto';
import { ItemTypes } from '../class/item-types';

describe('ItemService', () => {
  let service: ItemService;
  let itemRepository: ItemRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ItemService],
      providers: [LoggerWinstonService, { provide: getRepositoryToken(ItemRepository), useClass: Repository }],
    }).compile();

    service = module.get<ItemService>(ItemService);
    itemRepository = module.get(getRepositoryToken(ItemRepository));
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

  });
  it('should delete item', async () => { })
  it('should update item', async () => { })
  it('should select item', async () => { })
});
