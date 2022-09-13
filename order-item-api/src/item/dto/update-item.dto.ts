import { ItemTypes } from '../class/item-types';

class UpdateItemDto {
    id: number;
    name: string;
    price: number;
    description: string;
    type: ItemTypes;
    discount: number;
}
export { UpdateItemDto };
