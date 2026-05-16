import {
  Injectable,
} from '@nestjs/common';

import {
  PrismaService,
} from '../prisma/prisma.service';

@Injectable()

export class ProductsService {

  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE PRODUCT
  async create(
    data: any,
  ) {

    return this.prisma.product.create({

      data: {

        name:
          data.name,

        price:
          Number(
            data.price,
          ),

        stock:
          Number(
            data.stock,
          ),

        barcode:
          data.barcode || '',
      },
    });
  }

  // GET PRODUCTS
  async findAll() {

    return this.prisma.product.findMany({

      orderBy: {
        createdAt:
          'desc',
      },
    });
  }

  // GET ONE
  async findOne(
    id: string,
  ) {

    return this.prisma.product.findUnique({

      where: {
        id,
      },
    });
  }

  // UPDATE
  async update(
    id: string,

    data: any,
  ) {

    return this.prisma.product.update({

      where: {
        id,
      },

      data: {

        name:
          data.name,

        price:
          Number(
            data.price,
          ),

        stock:
          Number(
            data.stock,
          ),

        barcode:
          data.barcode || '',
      },
    });
  }

  // DELETE
  async remove(
    id: string,
  ) {

    return this.prisma.product.delete({

      where: {
        id,
      },
    });
  }
}