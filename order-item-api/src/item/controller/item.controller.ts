import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemFilters } from '../class/item-filters';
import { CreateItemDto } from '../dto/createItem.dto';
import { ItemService } from '../service/item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) { }
  @Get()
  async getItem(@Param() params: ItemFilters): Promise<string> {
    try {
      await this.itemService.selectItems(params);
      return '';
    } catch (error) {
      console.error(error);
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
  async updateItem() { }

  @Delete()
  @HttpCode(204)
  async deleteItem() { }
}
