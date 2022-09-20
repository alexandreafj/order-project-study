import { ItemTypes } from "../class/item-types";
import { Length, IsEnum, IsOptional } from 'class-validator';

export class ItemDto {
    @IsOptional()
    id?: number;

    @IsOptional()
    @Length(0, 255)
    name?: string;

    @IsOptional()
    price?: number;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsEnum(ItemTypes)
    type?: ItemTypes;

    @IsOptional()
    discount?: number;
}