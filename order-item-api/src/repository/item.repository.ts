import { Injectable } from '@nestjs/common';
import { Item as ItemEntity } from '../entitys/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from '../common/interfaces/Repo';
import { LoggerWinstonService } from '../common/helpers/service/logger-winston.service';
import { WinstonLevels } from '../common/helpers/class/winston-levels.enum';
import { ItemFilters } from 'src/item/class/item-filters';
import { ItemDeleteDto } from 'src/item/dto/item-delete-dto';

@Injectable()
export class ItemRepository implements Repo<ItemEntity>{
    constructor(
        @InjectRepository(ItemEntity)
        private readonly ItemRepo: Repository<ItemEntity>,
        private readonly logger: LoggerWinstonService,
    ) { }

    async exists(t: ItemEntity): Promise<boolean> {
        const foundItem = await this.ItemRepo.find({ where: { id: t.id } });
        return !!foundItem;
    }
    async save(t: ItemEntity) {
        const queryRunner = this.ItemRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const itemEntity = this.ItemRepo.create({
                ...t,
            });
            await queryRunner.manager.save(itemEntity);
            await queryRunner.commitTransaction();
        } catch (error) {
            console.error(error);
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    async delete(t: ItemDeleteDto): Promise<void> {
        const queryRunner = this.ItemRepo.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(ItemEntity, t.ids);
            await queryRunner.commitTransaction();
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    async update(t: ItemEntity) {
        try {
            await this.ItemRepo.createQueryBuilder().update(ItemEntity).set({ ...t }).where("id = :id", { id: t.id }).execute()
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        }
    }

    async select(itemFilter: ItemFilters): Promise<Array<ItemEntity>> {
        try {
            return await this.ItemRepo.find({
                select: {
                    id: true,
                    description: true,
                    discount: true,
                    name: true,
                    price: true,
                    type: true,
                },
                where: {
                    name: itemFilter?.name ?? null,
                    price: itemFilter?.price ?? null,
                    type: itemFilter?.type ?? null,
                },
                take: itemFilter.limit,
                skip: itemFilter.offset,
            });
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        }
    }
}
