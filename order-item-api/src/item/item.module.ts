import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheService } from 'src/common/helpers/service/cache.service';
import { LoggerWinstonService } from 'src/common/helpers/service/logger-winston.service';
import { ItemRepository } from 'src/repository/item.repository';
import { Item } from '../entitys/item.entity';
import { ItemController } from './controller/item.controller';
import { ItemService } from './service/item.service';

@Module({
    imports: [TypeOrmModule.forFeature([Item])],
    controllers: [ItemController],
    providers: [ItemService, ItemRepository, LoggerWinstonService, CacheService],
})
export class ItemModule {
}