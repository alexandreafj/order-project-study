import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [],
  controllers: [OrderController],
  providers: [],
})
export class OrderModule { }
