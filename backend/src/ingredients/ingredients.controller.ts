import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.ingredientsService.search(search);
    }

    return this.ingredientsService.findAll();
  }

  @Get(':ingredientID')
  findOne(@Param('ingredientID', ParseIntPipe) ingredientID: number) {
    return this.ingredientsService.findOne(ingredientID);
  }
}
