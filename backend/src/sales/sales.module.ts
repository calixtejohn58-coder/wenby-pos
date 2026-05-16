import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],

  controllers: [SalesController],

  providers: [SalesService],
})
export class SalesModule {}