import { ItemTypes } from "../../src/item/class/item-types";
import { ItemFilters } from "../../src/item/class/item-filters";

const mockItemsFilters = (): ItemFilters => {
    const itemFilters = new ItemFilters();
    itemFilters.limit = 100;
    itemFilters.offset = 0;
    itemFilters.name = 'test';
    itemFilters.price = 10;
    itemFilters.type = ItemTypes.Eletronic;
    return itemFilters;
}

export { mockItemsFilters };