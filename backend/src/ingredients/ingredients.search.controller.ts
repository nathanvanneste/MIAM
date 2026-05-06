import { Controller, Get, Query } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Controller('ingredients')
export class IngredientsSearchController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async search(@Query('search') search?: string) {
    const where = search
      ? {
          name: {
            contains: search.trim(),
            mode: 'insensitive' as const,
          },
        }
      : undefined

    return this.prisma.ingredient.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 20,
    })
  }
}
