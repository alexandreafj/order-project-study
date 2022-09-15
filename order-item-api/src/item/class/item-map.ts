import { Item } from "src/entitys/item.entity";
import { Mapper } from '../../common/interfaces/Mapper';

class ItemMap implements Mapper<Item> {
    toDomain(raw: any): Item {
        throw new Error("Method not implemented.");
    }
    toPersistance(t: Item): Item {
        throw new Error("Method not implemented.");
    }
    toDTO(item: Item): Item {
        throw new Error("Method not implemented.");
    }

}