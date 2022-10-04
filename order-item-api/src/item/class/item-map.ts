import { Item } from "../../entitys/item.entity";
import { ItemDto } from "../dto/Item-dto";

export abstract class ItemMap {
    public static toEntity(raw: ItemDto): Item {
        return {
            id: raw?.id ?? undefined,
            description: raw?.description ?? undefined,
            discount: raw?.discount ?? undefined,
            name: raw?.name ?? undefined,
            price: raw?.price ?? undefined,
            type: raw?.type ?? undefined,
        } as unknown as Item;
    }

    public static toEntityArray(raw: Array<ItemDto>): Array<Item> {
        return raw?.map(entity => {
            return {
                id: entity?.id ?? undefined,
                description: entity?.description ?? undefined,
                discount: entity?.discount ?? undefined,
                name: entity?.name ?? undefined,
                price: entity?.price ?? undefined,
                type: entity?.type ?? undefined,
            } as unknown as Item;
        }) ?? [];
    }

    public static toDTO(item: Item): ItemDto {
        return {
            id: item?.id ?? undefined,
            name: item?.name ?? undefined,
            price: item?.price ?? undefined,
            description: item?.description ?? undefined,
            type: item?.type ?? undefined,
            discount: item?.discount ?? undefined,
        } as unknown as ItemDto;
    }

    public static toArrayDTO(arrItem: Array<Item>): Array<ItemDto> {
        return arrItem?.map(entity => {
            return {
                id: entity?.id ?? undefined,
                name: entity?.name ?? undefined,
                price: entity?.price ?? undefined,
                description: entity?.description ?? undefined,
                type: entity?.type ?? undefined,
                discount: entity?.discount ?? undefined,
            } as unknown as ItemDto;
        }) ?? []
    }
}