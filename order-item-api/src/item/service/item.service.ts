import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from '../class/Item';
import { ItemFilters } from '../class/item-filters';
import { ItemDto } from '../dto/Item-dto';
import { ItemRepository } from '../../repository/item.repository';
import { ItemMap } from '../class/item-map';
import { ItemDeleteDto } from '../dto/item-delete-dto';

@Injectable()
export class ItemService {
    constructor(private readonly itemRepository: ItemRepository) { }

    async selectItems(filters: ItemFilters): Promise<Array<ItemDto>> {
        const itemsEntity = await this.itemRepository.select(filters);
        const hasFoundAny = !!itemsEntity && itemsEntity?.length > 0;
        if (hasFoundAny === false) return [];
        const itemsDto = ItemMap.toArrayDTO(itemsEntity);
        return itemsDto;
    }

    async insertItem(createItemDto: ItemDto): Promise<void> {
        const itemEntity = ItemMap.toEntity(createItemDto);
        delete itemEntity.id;
        await this.itemRepository.save(itemEntity);
    }

    async deleteItem(deleteItemsDto: ItemDeleteDto): Promise<void> {
        await this.itemRepository.delete(deleteItemsDto);
    }

    async updateItem(updateItemDto: ItemDto) {
        const updateItem = ItemMap.toEntity(updateItemDto);
        const existItem = await this.itemRepository.exists(updateItem);
        if (existItem === false) {
            throw new NotFoundException('Item not found!');
        }
        await this.itemRepository.update(updateItem);
    }
}
