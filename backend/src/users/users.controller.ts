import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
  constructor(
    private prisma:
      PrismaService,
  ) {}

  @Get()
  getUsers() {
    return this.prisma.user.findMany();
  }

  @Post()
  createUser(
    @Body() body,
  ) {
    return this.prisma.user.create({
      data: body,
    });
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
  ) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}