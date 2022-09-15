import { Injectable } from '@nestjs/common';
import { Item } from '../class/Item';
import { Item as ItemEntity } from '../../entitys/item.entity';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';
import { DeleteItemDto } from '../dto/delete-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor() { }

    async selectItems(filters: ItemFilters): Promise<Array<Item>> {
        return [new Item()];
    }

    async insertItem(createItemDto: CreateItemDto) {

        //this.itemRepository.create();
    }

    async deleteItem(deleteItemsDto: Array<DeleteItemDto>) {

    }

    async updateItem(updateItemDto: UpdateItemDto) {

    }
}
