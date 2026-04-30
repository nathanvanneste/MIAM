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
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { AddGroupRecipeDto } from './dto/add-group-recipe.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':groupID')
  findOne(@Param('groupID', ParseIntPipe) groupID: number) {
    return this.groupsService.findOne(groupID);
  }

  @Patch(':groupID')
  update(
    @Param('groupID', ParseIntPipe) groupID: number,
    @Body() updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(groupID, updateGroupDto);
  }

  @Delete(':groupID')
  remove(@Param('groupID', ParseIntPipe) groupID: number) {
    return this.groupsService.remove(groupID);
  }

  @Post(':groupID/members')
  addMember(
    @Param('groupID', ParseIntPipe) groupID: number,
    @Body() addGroupMemberDto: AddGroupMemberDto,
  ) {
    return this.groupsService.addMember(groupID, addGroupMemberDto);
  }

  @Delete(':groupID/members/:userID')
  removeMember(
    @Param('groupID', ParseIntPipe) groupID: number,
    @Param('userID') userID: string,
  ) {
    return this.groupsService.removeMember(groupID, userID);
  }

  @Post(':groupID/recipes')
  addRecipe(
    @Param('groupID', ParseIntPipe) groupID: number,
    @Body() addGroupRecipeDto: AddGroupRecipeDto,
  ) {
    return this.groupsService.addRecipe(groupID, addGroupRecipeDto);
  }

  @Delete(':groupID/recipes/:recipeID')
  removeRecipe(
    @Param('groupID', ParseIntPipe) groupID: number,
    @Param('recipeID', ParseIntPipe) recipeID: number,
  ) {
    return this.groupsService.removeRecipe(groupID, recipeID);
  }
}