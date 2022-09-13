import { ItemTypes } from "./item-types"

class ItemFilters {
    limit: number;
    offset: number;
    name: string;
    price: number;
    type: ItemTypes;
}
export { ItemFilters };