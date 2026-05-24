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

    // CREATE BUSINESS
    const business =
      await this.prisma.business.create({

        data: {

          name:
            `${dto.fullName} Business`,
        },
      });

    // CREATE ADMIN USER
    const user =
      await this.prisma.user.create({

        data: {

          fullName:
            dto.fullName,

          email:
            dto.email,

          password:
            hashedPassword,

          role:
            'ADMIN',

          businessId:
            business.id,
        },
      });

    const {
      password,
      ...safeUser
    } = user;

    return {

      message:
        'Business created successfully',

      user:
        safeUser,

      business,
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

        include: {
          business: true,
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

        id:
          user.id,

        email:
          user.email,

        role:
          user.role,

        businessId:
          user.businessId,
      });

    const {
      password,
      ...safeUser
    } = user;

    return {

      access_token:
        token,

      user:
        safeUser,
    };
  }
}