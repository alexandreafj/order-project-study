import { ItemTypes } from '../item/class/item-types';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: boolean;

  @Column({
    type: 'enum',
    enum: ItemTypes,
  })
  type: ItemTypes;

  @Column()
  discount: number;
}