import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipStatusDto } from './dto/update-friendship-status.dto';
import { SaveRecipeDto } from './dto/save-recipe.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) return this.usersService.search(search);
    return this.usersService.findAll();
  }

  @Get(':userID')
  findOne(@Param('userID', ParseIntPipe) userID: number) {
    return this.usersService.findOne(userID);
  }

  @Patch(':userID')
  update(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userID, dto);
  }

  @Delete(':userID')
  remove(@Param('userID', ParseIntPipe) userID: number) {
    return this.usersService.remove(userID);
  }

  @Post('friendships')
  sendFriendRequest(@Body() dto: CreateFriendshipDto) {
    return this.usersService.sendFriendRequest(dto);
  }

  @Patch('friendships/:requesterID/:receiverID')
  updateFriendship(
    @Param('requesterID', ParseIntPipe) requesterID: number,
    @Param('receiverID', ParseIntPipe) receiverID: number,
    @Body() dto: UpdateFriendshipStatusDto,
  ) {
    return this.usersService.updateFriendship(
      requesterID,
      receiverID,
      dto,
    );
  }

  @Delete('friendships/:requesterID/:receiverID')
  removeFriendship(
    @Param('requesterID', ParseIntPipe) requesterID: number,
    @Param('receiverID', ParseIntPipe) receiverID: number,
  ) {
    return this.usersService.removeFriendship(
      requesterID,
      receiverID,
    );
  }

  @Post(':userID/saved-recipes')
  saveRecipe(
    @Param('userID', ParseIntPipe) userID: number,
    @Body() dto: SaveRecipeDto,
  ) {
    return this.usersService.saveRecipe(userID, dto.recipeID);
  }

  @Get(':userID/saved-recipes')
  findSavedRecipes(@Param('userID', ParseIntPipe) userID: number) {
    return this.usersService.findSavedRecipes(userID);
  }

  @Delete(':userID/saved-recipes/:recipeID')
  unsaveRecipe(
    @Param('userID', ParseIntPipe) userID: number,
    @Param('recipeID', ParseIntPipe) recipeID: number,
  ) {
    return this.usersService.unsaveRecipe(userID, recipeID);
  }
}