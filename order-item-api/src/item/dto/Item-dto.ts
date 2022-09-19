import { ItemTypes } from "../class/item-types";

export class ItemDto {
    id?: number;
    name?: string;
    price?: number;
    description?: string;
    type?: ItemTypes;
    discount?: number;
}