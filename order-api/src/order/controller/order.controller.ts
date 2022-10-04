import { Controller, Get, HttpCode } from '@nestjs/common';
import { PublisherService } from 'src/common/service/publisher.service';

@Controller('/api/v1/order')
export class OrderController {
  constructor(private readonly publisher: PublisherService) { }
  @Get()
  @HttpCode(200)
  async getOrders(): Promise<string> {
    this.publisher.publishMessage('Hello World');
    return 'Hello World';
  }
}
