import { Module }
from '@nestjs/common';

import { BusinessesController }
from './businesses.controller';

import { BusinessesService }
from './businesses.service';

import { PrismaModule }
from '../prisma/prisma.module';

@Module({

  imports: [
    PrismaModule,
  ],

  controllers: [
    BusinessesController,
  ],

  providers: [
    BusinessesService,
  ],
})

export class BusinessesModule {}