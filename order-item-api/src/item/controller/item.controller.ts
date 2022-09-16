import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WinstonLevels } from '../../common/helpers/class/winston-levels.enum';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { Item } from '../class/Item';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';
import { DeleteItemDto } from '../dto/delete-item.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService, private readonly loggerWinstonService: LoggerWinstonService) { }
  @Get()
  @HttpCode(200)
  async getItem(@Param() params: ItemFilters): Promise<Array<Item>> {
    try {
      const items = await this.itemService.selectItems(params);
      this.loggerWinstonService.log(WinstonLevels.Info, 'test');
      return items;
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Post()
  @HttpCode(201)
  async createItem(@Body() createItemDto: CreateItemDto) {
    try {
      await this.itemService.insertItem(createItemDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Put()
  @HttpCode(204)
  async updateItem(@Body() updateItemDto: UpdateItemDto) {
    try {
      await this.itemService.updateItem(updateItemDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Delete()
  @HttpCode(204)
  async deleteItem(@Body() deleteItemsDto: Array<DeleteItemDto>) {
    try {
      await this.itemService.deleteItem(deleteItemsDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }
}
