import { Injectable } from '@nestjs/common';
import { Item as ItemEntity } from '../entitys/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Repo } from '../common/interfaces/Repo';
import { LoggerWinstonService } from '../common/helpers/service/logger-winston.service';
import { WinstonLevels } from '../common/helpers/class/winston-levels.enum';

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
        const queryRunner = this.ItemRepo.queryRunner;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.ItemRepo.save(t)
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
        } catch (err) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(err));
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    async delete(t: ItemEntity) {
        const queryRunner = this.ItemRepo.queryRunner;
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.ItemRepo.delete(t)
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
        } catch (err) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(err));
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }
    async update(t: ItemEntity) {
        try {
            await this.ItemRepo.createQueryBuilder().update(ItemEntity).set({ ...t }).where("id = :id", { id: t.id }).execute()
        } catch (err) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(err));
        }
    }
}
