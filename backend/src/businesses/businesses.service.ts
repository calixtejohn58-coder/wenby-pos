import { Injectable }
from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class BusinessesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  async findAll() {

    return this.prisma.business.findMany({

      include: {

        users: true,

        products: true,

        sales: true,
      },

      orderBy: {

        createdAt:
          'desc',
      },
    });
  }

  async suspend(
    id: string,
  ) {

    return this.prisma.business.update({

      where: {
        id,
      },

      data: {

        isActive:
          false,
      },
    });
  }
}