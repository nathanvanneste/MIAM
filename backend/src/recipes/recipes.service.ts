import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { AddRecipeIngredientDto } from './dto/add-recipe-ingredient.dto';
import { AddRecipeTagDto } from './dto/add-recipe-tag.dto';

@Injectable()
export class RecipesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly recipeInclude = {
    creator: true,
    savedBy: {
      include: {
        user: true,
      },
    },
    steps: {
      orderBy: {
        order: 'asc' as const,
      },
    },
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
    reviews: {
      include: {
        user: true,
      },
    },
    groups: true,
  };

  async create(userID: string, createRecipeDto: CreateRecipeDto) {
    const { steps, ingredients, tagIDs, ...recipeData } =
      createRecipeDto;

    return this.prisma.recipe.create({
      data: {
        ...recipeData,

        creator: {
          connect: { userID },
        },

        steps: steps
          ? {
              create: steps.map((step) => ({
                text: step.text,
                order: step.order,
              })),
            }
          : undefined,

        ingredients: ingredients
          ? {
              create: ingredients.map((recipeIngredient) => ({
                quantity: recipeIngredient.quantity,
                ingredient: {
                  connect: { ingredientID: recipeIngredient.ingredientID },
                },
                unit: {
                  connect: { unitID: recipeIngredient.unitID },
                },
              })),
            }
          : undefined,

        tags: tagIDs
          ? {
              create: tagIDs.map((tagID) => ({
                tag: {
                  connect: { tagID },
                },
              })),
            }
          : undefined,
      },
      include: this.recipeInclude,
    });
  }

  async findAll() {
    return this.prisma.recipe.findMany({
      include: this.recipeInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(recipeID: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { recipeID },
      include: this.recipeInclude,
    });

    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeID} not found`);
    }

    return recipe;
  }

  async update(recipeID: number, updateRecipeDto: UpdateRecipeDto) {
    await this.findOne(recipeID);

    const { steps, ingredients, tagIDs, ...recipeData } =
      updateRecipeDto;

    return this.prisma.recipe.update({
      where: { recipeID },
      data: {
        ...recipeData,

        steps: steps
          ? {
              deleteMany: {},
              create: steps.map((step) => ({
                text: step.text,
                order: step.order,
              })),
            }
          : undefined,

        ingredients: ingredients
          ? {
              deleteMany: {},
              create: ingredients.map((recipeIngredient) => ({
                quantity: recipeIngredient.quantity,
                ingredient: {
                  connect: { ingredientID: recipeIngredient.ingredientID },
                },
                unit: {
                  connect: { unitID: recipeIngredient.unitID },
                },
              })),
            }
          : undefined,

        tags: tagIDs
          ? {
              deleteMany: {},
              create: tagIDs.map((tagID) => ({
                tag: {
                  connect: { tagID },
                },
              })),
            }
          : undefined,
      },
      include: this.recipeInclude,
    });
  }

  async remove(recipeID: number) {
    await this.findOne(recipeID);

    return this.prisma.recipe.delete({
      where: { recipeID },
    });
  }

  async addStep(recipeID: number, createStepDto: CreateStepDto) {
    await this.findOne(recipeID);

    return this.prisma.step.create({
      data: {
        text: createStepDto.text,
        order: createStepDto.order,
        recipeID,
      },
    });
  }

  async updateStep(stepID: number, updateStepDto: UpdateStepDto) {
    const step = await this.prisma.step.findUnique({
      where: { stepID },
    });

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepID} not found`);
    }

    return this.prisma.step.update({
      where: { stepID },
      data: updateStepDto,
    });
  }

  async removeStep(stepID: number) {
    const step = await this.prisma.step.findUnique({
      where: { stepID },
    });

    if (!step) {
      throw new NotFoundException(`Step with ID ${stepID} not found`);
    }

    return this.prisma.step.delete({
      where: { stepID },
    });
  }

  async addIngredient(
    recipeID: number,
    addRecipeIngredientDto: AddRecipeIngredientDto,
  ) {
    await this.findOne(recipeID);

    const existingIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeID_ingredientID: {
          recipeID,
          ingredientID: addRecipeIngredientDto.ingredientID,
        },
      },
    });

    if (existingIngredient) {
      throw new ConflictException('Ingredient is already in this recipe');
    }

    return this.prisma.recipeIngredient.create({
      data: {
        recipeID,
        ingredientID: addRecipeIngredientDto.ingredientID,
        quantity: addRecipeIngredientDto.quantity,
        unitID: addRecipeIngredientDto.unitID,
      },
      include: {
        ingredient: true,
        unit: true,
      },
    });
  }

  async removeIngredient(recipeID: number, ingredientID: number) {
    const existingIngredient = await this.prisma.recipeIngredient.findUnique({
      where: {
        recipeID_ingredientID: {
          recipeID,
          ingredientID,
        },
      },
    });

    if (!existingIngredient) {
      throw new NotFoundException('Ingredient is not in this recipe');
    }

    return this.prisma.recipeIngredient.delete({
      where: {
        recipeID_ingredientID: {
          recipeID,
          ingredientID,
        },
      },
    });
  }

  async addTag(recipeID: number, addRecipeTagDto: AddRecipeTagDto) {
    await this.findOne(recipeID);

    const existingTag = await this.prisma.recipeTag.findUnique({
      where: {
        recipeID_tagID: {
          recipeID,
          tagID: addRecipeTagDto.tagID,
        },
      },
    });

    if (existingTag) {
      throw new ConflictException('Tag is already linked to this recipe');
    }

    return this.prisma.recipeTag.create({
      data: {
        recipeID,
        tagID: addRecipeTagDto.tagID,
      },
      include: {
        tag: true,
      },
    });
  }

  async removeTag(recipeID: number, tagID: number) {
    const existingTag = await this.prisma.recipeTag.findUnique({
      where: {
        recipeID_tagID: {
          recipeID,
          tagID,
        },
      },
    });

    if (!existingTag) {
      throw new NotFoundException('Tag is not linked to this recipe');
    }

    return this.prisma.recipeTag.delete({
      where: {
        recipeID_tagID: {
          recipeID,
          tagID,
        },
      },
    });
  }

  async addReview(userID: string, createReviewDto: CreateReviewDto) {
    const existingReview = await this.prisma.review.findUnique({
      where: {
        userID_recipeID: {
          userID,
          recipeID: createReviewDto.recipeID,
        },
      },
    });

    if (existingReview) {
      throw new ConflictException('User has already reviewed this recipe');
    }

    return this.prisma.review.create({
      data: {
        rating: createReviewDto.rating,
        comment: createReviewDto.comment,
        recipeID: createReviewDto.recipeID,
        userID,
      },
      include: {
        user: true,
        recipe: true,
      },
    });
  }

  async updateReview(reviewID: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { reviewID },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewID} not found`);
    }

    return this.prisma.review.update({
      where: { reviewID },
      data: updateReviewDto,
    });
  }

  async removeReview(reviewID: number) {
    const review = await this.prisma.review.findUnique({
      where: { reviewID },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewID} not found`);
    }

    return this.prisma.review.delete({
      where: { reviewID },
    });
  }

  async updateRecipePhoto(userID: string, recipeID: number, photo: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: {
        recipeID,
      },
      select: {
        recipeID: true,
        creatorID: true,
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recette introuvable.');
    }

    if (recipe.creatorID !== userID) {
      throw new ForbiddenException(
        "Vous ne pouvez modifier que les photos de vos propres recettes.",
      );
    }

    const expectedPrefix = `${userID}/${recipeID}/`;

    if (!photo.startsWith(expectedPrefix)) {
      throw new BadRequestException(
        "Le chemin de la photo ne correspond pas à la recette ou à l'utilisateur connecté.",
      );
    }

    return this.prisma.recipe.update({
      where: {
        recipeID,
      },
      data: {
        photo,
      },
    });
  }

  findMine(userID: string) {
    return this.prisma.recipe.findMany({
      where: {
        creatorID: userID,
      },
      include: this.recipeInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}

