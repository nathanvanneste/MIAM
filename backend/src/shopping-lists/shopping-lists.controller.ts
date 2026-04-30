import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly shoppingListsService: ShoppingListsService,
  ) {}

  @Post()
  create(@Body() dto: CreateShoppingListDto) {
    return this.shoppingListsService.create(dto);
  }

  @Get()
  findAll() {
    return this.shoppingListsService.findAll();
  }

  @Get(':listID')
  findOne(@Param('listID', ParseIntPipe) listID: number) {
    return this.shoppingListsService.findOne(listID);
  }

  @Patch(':listID')
  update(
    @Param('listID', ParseIntPipe) listID: number,
    @Body() dto: UpdateShoppingListDto,
  ) {
    return this.shoppingListsService.update(listID, dto);
  }

  @Delete(':listID')
  remove(@Param('listID', ParseIntPipe) listID: number) {
    return this.shoppingListsService.remove(listID);
  }

  @Post(':listID/items')
  addItem(
    @Param('listID', ParseIntPipe) listID: number,
    @Body() dto: CreateShoppingItemDto,
  ) {
    return this.shoppingListsService.addItem(listID, dto);
  }

  @Patch('items/:itemID')
  updateItem(
    @Param('itemID', ParseIntPipe) itemID: number,
    @Body() dto: UpdateShoppingItemDto,
  ) {
    return this.shoppingListsService.updateItem(itemID, dto);
  }

  @Delete('items/:itemID')
  removeItem(@Param('itemID', ParseIntPipe) itemID: number) {
    return this.shoppingListsService.removeItem(itemID);
  }

  @Patch('items/:itemID/toggle')
  toggleItem(@Param('itemID', ParseIntPipe) itemID: number) {
    return this.shoppingListsService.toggleItem(itemID);
  }
}