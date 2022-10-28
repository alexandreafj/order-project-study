import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CacheService } from '../../common/helpers/service/cache.service';
import { WinstonLevels } from '../../common/helpers/class/winston-levels.enum';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemFilters } from '../class/item-filters';
import { ItemDeleteDto } from '../dto/item-delete-dto';
import { ItemDto } from '../dto/Item-dto';
import { ItemService } from '../service/item.service';

@Controller('api/v1/item')
export class ItemController {
  private readonly keyPatternSelect = 'select:item';

  constructor(private readonly itemService: ItemService, private readonly loggerWinstonService: LoggerWinstonService, private readonly cacheService: CacheService) { }

  @Get()
  @HttpCode(200)
  async getItem(@Query() params: ItemFilters): Promise<Array<ItemDto>> {
    try {
      const key = `select:item:${JSON.stringify(params)}`;
      const rawItems = await this.cacheService.get(key);
      const hasRawItems = !!rawItems;
      if (hasRawItems) {
        const itemsDto = JSON.parse(rawItems) as Array<ItemDto>;
        return itemsDto;
      }
      const items = await this.itemService.selectItems(params);
      await this.cacheService.set(key, items);
      return items;
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, JSON.stringify(error));
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Post()
  @HttpCode(201)
  async createItem(@Body() createItemDto: ItemDto) {
    try {
      await Promise.allSettled([
        this.itemService.insertItem(createItemDto),
        this.cacheService.del(this.keyPatternSelect),
      ]);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, JSON.stringify(error));
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Put()
  @HttpCode(204)
  async updateItem(@Body() updateItemDto: ItemDto) {
    try {
      await Promise.allSettled([
        this.itemService.updateItem(updateItemDto),
        this.cacheService.del(this.keyPatternSelect),
      ]);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, JSON.stringify(error));
      if (error?.response?.statusCode) {
        throw error;
      }
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Delete()
  @HttpCode(204)
  async deleteItem(@Body() deleteItemsDto: ItemDeleteDto) {
    try {
      await Promise.allSettled([
        this.itemService.deleteItem(deleteItemsDto),
        this.cacheService.del(this.keyPatternSelect),
      ]);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, JSON.stringify(error));
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }
}