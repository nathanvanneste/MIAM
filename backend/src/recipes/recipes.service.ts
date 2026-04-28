import { Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRecipeDto) {
    return this.prisma.recipe.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        nutritionalScore: dto.nutritionalScore,
        prepTime: dto.prepTime,
        cookTime: dto.cookTime,
        photo: dto.photo,
        portion: dto.portion,

        creator: {
          connect: {
            userID: dto.creatorID,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: {
        creator: true,
        steps: true,
        ingredients: {
          include: {
            ingredient: true,
            unit: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
