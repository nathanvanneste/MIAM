import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class IngredientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(ingredientID: number) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { ingredientID },
    });

    if (!ingredient) {
      throw new NotFoundException(
        `Ingredient with ID ${ingredientID} not found`,
      );
    }

    return ingredient;
  }

  async search(search: string) {
    return this.prisma.ingredient.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
