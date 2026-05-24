import { Module } from '@nestjs/common';

import { ConfigModule }
from '@nestjs/config';

import { AppController }
from './app.controller';

import { AppService }
from './app.service';

import { AuthModule }
from './auth/auth.module';

import { PrismaModule }
from './prisma/prisma.module';

import { ProductsModule }
from './products/products.module';

import { SalesModule }
from './sales/sales.module';

import { UsersController }
from './users/users.controller';

import { BusinessesModule }
from './businesses/businesses.module';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,
    }),

    PrismaModule,

    AuthModule,

    ProductsModule,

    SalesModule,

    BusinessesModule,
  ],

  controllers: [

    AppController,

    UsersController,
  ],

  providers: [
    AppService,
  ],
})

export class AppModule {}