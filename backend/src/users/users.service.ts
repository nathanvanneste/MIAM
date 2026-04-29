import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateFriendshipDto } from './dto/create-friendship.dto';
import { UpdateFriendshipStatusDto } from './dto/update-friendship-status.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly include = {
    recipes: true,
    reviews: true,
    shoppingList: true,
    sentFriendships: true,
    receivedFriendships: true,
    groupMemberships: true,
  };

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { pseudo: 'asc' },
    });
  }

  async findOne(userID: number) {
    const user = await this.prisma.user.findUnique({
      where: { userID },
      include: this.include,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userID} not found`);
    }

    return user;
  }

  async search(search: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { pseudo: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ],
      },
      orderBy: { pseudo: 'asc' },
    });
  }

  async update(userID: number, dto: UpdateUserDto) {
    await this.findOne(userID);

    return this.prisma.user.update({
      where: { userID },
      data: dto,
    });
  }

  async remove(userID: number) {
    await this.findOne(userID);

    return this.prisma.user.delete({
      where: { userID },
    });
  }

  async sendFriendRequest(dto: CreateFriendshipDto) {
    if (dto.requesterID === dto.receiverID) {
      throw new ConflictException('Cannot add yourself');
    }

    const existing = await this.prisma.friendship.findUnique({
      where: {
        requesterID_receiverID: {
          requesterID: dto.requesterID,
          receiverID: dto.receiverID,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Friendship already exists');
    }

    return this.prisma.friendship.create({
      data: dto,
    });
  }

  async updateFriendship(
    requesterID: number,
    receiverID: number,
    dto: UpdateFriendshipStatusDto,
  ) {
    const friendship = await this.prisma.friendship.findUnique({
      where: {
        requesterID_receiverID: {
          requesterID,
          receiverID,
        },
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    return this.prisma.friendship.update({
      where: {
        requesterID_receiverID: {
          requesterID,
          receiverID,
        },
      },
      data: {
        status: dto.status,
      },
    });
  }

  async removeFriendship(requesterID: number, receiverID: number) {
    const friendship = await this.prisma.friendship.findUnique({
      where: {
        requesterID_receiverID: {
          requesterID,
          receiverID,
        },
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    return this.prisma.friendship.delete({
      where: {
        requesterID_receiverID: {
          requesterID,
          receiverID,
        },
      },
    });
  }
}