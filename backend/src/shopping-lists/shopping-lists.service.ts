import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShoppingListDto } from './dto/create-shopping-list.dto';
import { UpdateShoppingListDto } from './dto/update-shopping-list.dto';
import { CreateShoppingItemDto } from './dto/create-shopping-item.dto';
import { UpdateShoppingItemDto } from './dto/update-shopping-item.dto';

@Injectable()
export class ShoppingListsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    items: {
      include: {
        ingredient: true,
        unit: true,
      },
    },
    user: true,
    group: true,
  };

  async create(createShoppingListDto: CreateShoppingListDto) {
    return this.prisma.shoppingList.create({
      data: createShoppingListDto,
      include: this.include,
    });
  }

  async findAll() {
    return this.prisma.shoppingList.findMany({
      include: this.include,
    });
  }

  async findOne(listID: number) {
    const list = await this.prisma.shoppingList.findUnique({
      where: { listID },
      include: this.include,
    });

    if (!list) {
      throw new NotFoundException(
        `Shopping list with ID ${listID} not found`,
      );
    }

    return list;
  }

  async update(
    listID: number,
    updateShoppingListDto: UpdateShoppingListDto,
  ) {
    await this.findOne(listID);

    return this.prisma.shoppingList.update({
      where: { listID },
      data: updateShoppingListDto,
      include: this.include,
    });
  }

  async remove(listID: number) {
    await this.findOne(listID);

    return this.prisma.shoppingList.delete({
      where: { listID },
    });
  }

  async addItem(listID: number, createShoppingItemDto: CreateShoppingItemDto) {
    await this.findOne(listID);

    return this.prisma.shoppingItem.create({
      data: {
        name: createShoppingItemDto.name,
        quantity: createShoppingItemDto.quantity,
        checked: createShoppingItemDto.checked ?? false,
        listID,
        ingredientID: createShoppingItemDto.ingredientID,
        unitID: createShoppingItemDto.unitID,
      },
      include: {
        ingredient: true,
        unit: true,
      },
    });
  }

  async updateItem(
    itemID: number,
    updateShoppingItemDto: UpdateShoppingItemDto,
  ) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { itemID },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemID} not found`);
    }

    return this.prisma.shoppingItem.update({
      where: { itemID },
      data: updateShoppingItemDto,
      include: {
        ingredient: true,
        unit: true,
      },
    });
  }

  async removeItem(itemID: number) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { itemID },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemID} not found`);
    }

    return this.prisma.shoppingItem.delete({
      where: { itemID },
    });
  }

  async toggleItem(itemID: number) {
    const item = await this.prisma.shoppingItem.findUnique({
      where: { itemID },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemID} not found`);
    }

    return this.prisma.shoppingItem.update({
      where: { itemID },
      data: {
        checked: !item.checked,
      },
    });
  }
}