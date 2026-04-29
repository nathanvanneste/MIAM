import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AddGroupMemberDto } from './dto/add-group-member.dto';
import { AddGroupRecipeDto } from './dto/add-group-recipe.dto';

@Injectable()
export class GroupsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto) {
    const { memberIDs, ...groupData } = createGroupDto;

    return this.prisma.groups.create({
      data: {
        ...groupData,
        members: memberIDs
          ? {
              create: memberIDs.map((userID) => ({
                user: {
                  connect: { userID },
                },
              })),
            }
          : undefined,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        recipes: true,
        shoppingList: true,
      },
    });
  }

  async findAll() {
    return this.prisma.groups.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        recipes: {
          include: {
            recipe: true,
          },
        },
        shoppingList: true,
      },
    });
  }

  async findOne(groupID: number) {
    const group = await this.prisma.groups.findUnique({
      where: { groupID },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        recipes: {
          include: {
            recipe: true,
          },
        },
        shoppingList: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupID} not found`);
    }

    return group;
  }

  async update(groupID: number, updateGroupDto: UpdateGroupDto) {
    await this.findOne(groupID);

    const { memberIDs, ...groupData } = updateGroupDto;

    return this.prisma.groups.update({
      where: { groupID },
      data: {
        ...groupData,
        members: memberIDs
          ? {
              deleteMany: {},
              create: memberIDs.map((userID) => ({
                user: {
                  connect: { userID },
                },
              })),
            }
          : undefined,
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        recipes: {
          include: {
            recipe: true,
          },
        },
        shoppingList: true,
      },
    });
  }

  async remove(groupID: number) {
    await this.findOne(groupID);

    return this.prisma.groups.delete({
      where: { groupID },
    });
  }

  async addMember(groupID: number, addGroupMemberDto: AddGroupMemberDto) {
    await this.findOne(groupID);

    const existingMember = await this.prisma.groupMember.findUnique({
      where: {
        groupID_userID: {
          groupID,
          userID: addGroupMemberDto.userID,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupID,
        userID: addGroupMemberDto.userID,
      },
    });
  }

  async removeMember(groupID: number, userID: number) {
    const existingMember = await this.prisma.groupMember.findUnique({
      where: {
        groupID_userID: {
          groupID,
          userID,
        },
      },
    });

    if (!existingMember) {
      throw new NotFoundException('User is not a member of this group');
    }

    return this.prisma.groupMember.delete({
      where: {
        groupID_userID: {
          groupID,
          userID,
        },
      },
    });
  }

  async addRecipe(groupID: number, addGroupRecipeDto: AddGroupRecipeDto) {
    await this.findOne(groupID);

    const existingRecipe = await this.prisma.groupRecipe.findUnique({
      where: {
        groupID_recipeID: {
          groupID,
          recipeID: addGroupRecipeDto.recipeID,
        },
      },
    });

    if (existingRecipe) {
      throw new ConflictException('Recipe is already in this group');
    }

    return this.prisma.groupRecipe.create({
      data: {
        groupID,
        recipeID: addGroupRecipeDto.recipeID,
      },
    });
  }

  async removeRecipe(groupID: number, recipeID: number) {
    const existingRecipe = await this.prisma.groupRecipe.findUnique({
      where: {
        groupID_recipeID: {
          groupID,
          recipeID,
        },
      },
    });

    if (!existingRecipe) {
      throw new NotFoundException('Recipe is not in this group');
    }

    return this.prisma.groupRecipe.delete({
      where: {
        groupID_recipeID: {
          groupID,
          recipeID,
        },
      },
    });
  }
}