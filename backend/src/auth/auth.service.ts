import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

import { RegisterDto }
from './dto/register.dto';

import { LoginDto }
from './dto/login.dto';

import * as bcrypt from 'bcrypt';

import { JwtService }
from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma:
      PrismaService,

    private jwtService:
      JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ) {
    const userExists =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (userExists) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        dto.password,
        10,
      );

    // AUTO ADMIN SYSTEM
    let role: any =
      'CASHIER';

    const userCount =
      await this.prisma.user.count();

    if (userCount === 0) {
      role = 'ADMIN';
    }

    const user =
      await this.prisma.user.create({
        data: {
          fullName:
            dto.fullName,

          email:
            dto.email,

          password:
            hashedPassword,

          role,
        },
      });

    const {
      password,
      ...safeUser
    } = user;

    return {
      message:
        'User created successfully',

      user: safeUser,
    };
  }

  async login(
    dto: LoginDto,
  ) {
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        dto.password,
        user.password,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const token =
      await this.jwtService.signAsync({
        id: user.id,

        email:
          user.email,

        role:
          user.role,
      });

    const {
      password,
      ...safeUser
    } = user;

    return {
      access_token:
        token,

      user: safeUser,
    };
  }
}