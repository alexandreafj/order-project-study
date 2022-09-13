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
import { Item } from '../class/Item';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }
  @Get()
  async getItem(@Param() params: ItemFilters): Promise<Array<Item>> {
    try {
      const items = await this.itemService.selectItems(params);
      return items;
    } catch (error) {
      console.log(error);
      console.error(error);
      throw new InternalServerErrorException('try again later');
    }
  }

  @Post()
  @HttpCode(201)
  async createItem(@Body() createItemDto: CreateItemDto) {
    try {
      await this.itemService.insertItem(createItemDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Put()
  @HttpCode(204)
  async updateItem(@Body() updateItemDto: UpdateItemDto) {
    try {
      await this.itemService.updateItem(updateItemDto);
    } catch (error) {

    }
  }

  @Delete()
  @HttpCode(204)
  async deleteItem() { }
}
