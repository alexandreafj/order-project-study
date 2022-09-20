import { IsNotEmpty } from 'class-validator';

export class ItemDeleteDto {
    @IsNotEmpty()
    ids: Array<number>;
}