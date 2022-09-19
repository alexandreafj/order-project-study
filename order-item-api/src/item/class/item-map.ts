import { Item } from "src/entitys/item.entity";
import { Mapper } from '../../common/interfaces/Mapper';
import { ItemDto } from "../dto/Item-dto";

class ItemMap implements Mapper<Item> {
    toDomain(raw: any): Item {
        return {
            id: raw?.id ?? null,
            description: raw?.description ?? null,
            discount: raw?.discount ?? null,
            name: raw?.name ?? null,
            price: raw?.price ?? null,
            type: raw?.type ?? null,
        } as Item;
    }
    toDTO(item: Item): ItemDto {
        return {
            id: item?.id ?? null,
            name: item?.name ?? null,
            price: item?.price ?? null,
            description: item?.description ?? null,
            type: item?.type ?? null,
            discount: item?.discount ?? null,
        } as unknown as ItemDto;
    }

}