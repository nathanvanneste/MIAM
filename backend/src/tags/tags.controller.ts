import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':tagID')
  findOne(@Param('tagID', ParseIntPipe) tagID: number) {
    return this.tagsService.findOne(tagID);
  }
}