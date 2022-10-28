// import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { PublisherService } from 'src/common/service/publisher.service';
// import { Repository } from 'typeorm';
// import { OrderService } from './order.service';

// describe('OrderService', () => {
//   let service: OrderService;
//   let publisher: PublisherService;
//   let orderRepository: OrderRepository;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [OrderService, PublisherService, OrderRepository, { provide: getRepositoryToken(Order), useClass: Repository }],
//     }).compile();

//     service = module.get<OrderService>(OrderService);
//     publisher = module.get<PublisherService>(PublisherService);
//     orderRepository = module.get(OrderRepository);
//   });

//   afterEach(async () => {
//     jest.clearAllMocks();
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   it('should order an item', async () => {
//     const mockIteemDto: ItemDto = {
//       id: 1,
//       name: 'phne',
//       price: 10,
//       description: 'teste',
//       type: ItemTypes.Eletronic,
//       discount: 0,
//     };
//     const spyPublishMessage = jest
//       .spyOn(publisher, 'publishMessage')
//       .mockImplementation(() => Promise.resolve());
//     const spyInsertOrder = jest
//       .spyOn(orderRepository, 'insertOrder')
//       .mockImplementation(() => Promise.resolve());
//     await service.orderItem(mockItemDto);
//     expect(spyPublishMessage).toBeCalledTimes(1);
//     expect(spyInsertOrder).toBeCalledTimes(1);
//   })
// });
