import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShoppingListsService } from './shopping-lists.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';

@UseGuards(JwtAuthGuard)
@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly shoppingListsService: ShoppingListsService,
  ) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateShoppingListDto) {
    return this.shoppingListsService.create(req.user.userID, dto);
  }

  @Get('me')
  findMine(@Req() req: AuthenticatedRequest) {
    return this.shoppingListsService.findMine(req.user.userID);
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

  @Post(':listID/import-recipe/:recipeID')
  importRecipe(
    @Req() req: AuthenticatedRequest,
    @Param('listID', ParseIntPipe) listID: number,
    @Param('recipeID', ParseIntPipe) recipeID: number,
  ) {
    return this.shoppingListsService.importRecipe(
      req.user.userID,
      listID,
      recipeID,
    );
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