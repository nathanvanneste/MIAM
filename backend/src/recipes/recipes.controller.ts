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
  UseGuards
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { AddRecipeIngredientDto } from './dto/add-recipe-ingredient.dto';
import { AddRecipeTagDto } from './dto/add-recipe-tag.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateRecipePhotoDto } from './dto/update-recipe-photo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() createRecipeDto: CreateRecipeDto) {
    return this.recipesService.create(req.user.userID, createRecipeDto);
  }

  @Get()
  findAll() {
    return this.recipesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@Req() req: AuthenticatedRequest) {
    return this.recipesService.findMine(req.user.userID);
  }

  @Get(':recipeID')
  findOne(@Param('recipeID', ParseIntPipe) recipeID: number) {
    return this.recipesService.findOne(recipeID);
  }

  @Patch(':recipeID')
  update(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipesService.update(recipeID, updateRecipeDto);
  }

  @Delete(':recipeID')
  remove(@Param('recipeID', ParseIntPipe) recipeID: number) {
    return this.recipesService.remove(recipeID);
  }

  @Post(':recipeID/steps')
  addStep(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() createStepDto: CreateStepDto,
  ) {
    return this.recipesService.addStep(recipeID, createStepDto);
  }

  @Patch('steps/:stepID')
  updateStep(
    @Param('stepID', ParseIntPipe) stepID: number,
    @Body() updateStepDto: UpdateStepDto,
  ) {
    return this.recipesService.updateStep(stepID, updateStepDto);
  }

  @Delete('steps/:stepID')
  removeStep(@Param('stepID', ParseIntPipe) stepID: number) {
    return this.recipesService.removeStep(stepID);
  }

  @Post(':recipeID/ingredients')
  addIngredient(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() addRecipeIngredientDto: AddRecipeIngredientDto,
  ) {
    return this.recipesService.addIngredient(
      recipeID,
      addRecipeIngredientDto,
    );
  }

  @Delete(':recipeID/ingredients/:ingredientID')
  removeIngredient(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Param('ingredientID', ParseIntPipe) ingredientID: number,
  ) {
    return this.recipesService.removeIngredient(recipeID, ingredientID);
  }

  @Post(':recipeID/tags')
  addTag(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() addRecipeTagDto: AddRecipeTagDto,
  ) {
    return this.recipesService.addTag(recipeID, addRecipeTagDto);
  }

  @Delete(':recipeID/tags/:tagID')
  removeTag(
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Param('tagID', ParseIntPipe) tagID: number,
  ) {
    return this.recipesService.removeTag(recipeID, tagID);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':recipeID/reviews')
  addReview(
    @Req() req: AuthenticatedRequest,
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.recipesService.addReview(req.user.userID,{
      ...createReviewDto,
      recipeID,
    });
  }

  @Patch('reviews/:reviewID')
  updateReview(
    @Param('reviewID', ParseIntPipe) reviewID: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.recipesService.updateReview(reviewID, updateReviewDto);
  }

  @Delete('reviews/:reviewID')
  removeReview(@Param('reviewID', ParseIntPipe) reviewID: number) {
    return this.recipesService.removeReview(reviewID);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':recipeID/photo')
  updateRecipePhoto(
    @Req() req: AuthenticatedRequest,
    @Param('recipeID', ParseIntPipe) recipeID: number,
    @Body() dto: UpdateRecipePhotoDto,
  ) {
    return this.recipesService.updateRecipePhoto(
      req.user.userID,
      recipeID,
      dto.photo,
    );
  }
}