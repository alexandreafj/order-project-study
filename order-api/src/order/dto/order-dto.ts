import { IsOptional, IsEnum } from 'class-validator';
import { OrderStatusTypes } from '../class/order-status-types';

export class OrderDto {
  @IsOptional()
  id?: number;

  @IsOptional()
  id_item: number;

  @IsOptional()
  @IsEnum(OrderStatusTypes)
  status: OrderStatusTypes;

  @IsOptional()
  created_at: Date;

  @IsOptional()
  updated_at: Date;
}
