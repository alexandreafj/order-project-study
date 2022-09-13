import { ItemTypes } from "./item-types";

class Item {
    id: number;
    name: string;
    price: number;
    description: string;
    type: ItemTypes;
    discount: number;
}
export { Item };