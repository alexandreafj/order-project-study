import { ItemTypes } from "./item-types"
import { IsNotEmpty, Length, IsEnum, IsOptional } from 'class-validator';

class ItemFilters {
    @IsNotEmpty()
    limit = 10;

    @IsNotEmpty()
    offset = 0;

    @Length(0, 255)
    @IsOptional()
    name?: string;

    @IsOptional()
    price?: number;

    @IsEnum(ItemTypes)
    @IsOptional()
    type?: ItemTypes;
}
export { ItemFilters };