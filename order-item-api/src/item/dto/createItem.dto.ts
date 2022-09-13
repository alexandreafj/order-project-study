import { ItemTypes } from '../class/item-types';

class CreateItemDto {
  name: string;
  price: number;
  description: string;
  type: ItemTypes;
  discount: number;
}
export { CreateItemDto };
