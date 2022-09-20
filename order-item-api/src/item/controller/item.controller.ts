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
  Query,
} from '@nestjs/common';
import { WinstonLevels } from '../../common/helpers/class/winston-levels.enum';
import { LoggerWinstonService } from '../../common/helpers/service/logger-winston.service';
import { ItemFilters } from '../class/item-filters';
import { ItemDeleteDto } from '../dto/item-delete-dto';
import { ItemDto } from '../dto/Item-dto';
import { ItemService } from '../service/item.service';

@Controller('api/v1/item')
export class ItemController {
  constructor(private readonly itemService: ItemService, private readonly loggerWinstonService: LoggerWinstonService) { }
  @Get()
  @HttpCode(200)
  async getItem(@Query() params: ItemFilters): Promise<Array<ItemDto>> {
    try {
      const items = await this.itemService.selectItems(params);
      return items;
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Post()
  @HttpCode(201)
  async createItem(@Body() createItemDto: ItemDto) {
    try {
      await this.itemService.insertItem(createItemDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Put()
  @HttpCode(204)
  async updateItem(@Body() updateItemDto: ItemDto) {
    try {
      await this.itemService.updateItem(updateItemDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }

  @Delete()
  @HttpCode(204)
  async deleteItem(@Body() deleteItemsDto: ItemDeleteDto) {
    try {
      await this.itemService.deleteItem(deleteItemsDto);
    } catch (error) {
      this.loggerWinstonService.log(WinstonLevels.Error, error.message);
      throw new InternalServerErrorException({ message: 'Something went wrong, try again later.' });
    }
  }
}
