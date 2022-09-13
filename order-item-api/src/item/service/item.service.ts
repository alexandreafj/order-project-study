import { Injectable } from '@nestjs/common';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';

@Injectable()
export class ItemService {
    async selectItems(filters: ItemFilters) {

    }

    async insertItem(createItemDto: CreateItemDto) {

    }

    async deleteItem() {

    }

    async updateItem() {

    }
}
