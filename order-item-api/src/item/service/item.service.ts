import { Injectable } from '@nestjs/common';
import { Item } from '../class/Item';
import { ItemFilters } from '../class/item-filters';
import { ItemDto } from '../dto/Item-dto';


@Injectable()
export class ItemService {
    constructor() { }

    async selectItems(filters: ItemFilters): Promise<Array<Item>> {
        return [new Item()];
    }

    async insertItem(createItemDto: ItemDto) {
    }

    async deleteItem(deleteItemsDto: Array<ItemDto>) {

    }

    async updateItem(updateItemDto: ItemDto) {

    }
}
