import { Injectable } from '@nestjs/common';
import { Item } from '../class/Item';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';
import { UpdateItemDto } from '../dto/update-item.dto';

@Injectable()
export class ItemService {
    async selectItems(filters: ItemFilters): Promise<Array<Item>> {
        return [new Item()];
    }

    async insertItem(createItemDto: CreateItemDto) {

    }

    async deleteItem() {

    }

    async updateItem(updateItemDto: UpdateItemDto) {

    }
}
