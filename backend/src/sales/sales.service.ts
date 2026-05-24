import { Injectable }
from '@nestjs/common';

import { PrismaService }
from '../prisma/prisma.service';

@Injectable()

export class SalesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  // CREATE SALE
  async create(
    createSaleDto: any,
  ) {

    const items =
      createSaleDto.items;

    let total = 0;

    // VERIFY PRODUCTS
    for (const item of items) {

      const product =
        await this.prisma.product.findUnique({

          where: {
            id: item.productId,
          },
        });

      if (!product) {

        throw new Error(
          'Produit introuvable',
        );
      }

      total +=
        product.price *
        item.quantity;
    }

    // GET CASHIER
    const cashier =
      await this.prisma.user.findFirst({

        where: {

          businessId:
            createSaleDto.businessId,
        },
      });

    if (!cashier) {

      throw new Error(
        'Aucun utilisateur',
      );
    }

    // CREATE SALE
    const sale =
      await this.prisma.sale.create({

        data: {

          total,

          businessId:
            createSaleDto.businessId,

          cashier: {

            connect: {

              id:
                cashier.id,
            },
          },
        },
      });

    // CREATE SALE ITEMS
    for (const item of items) {

      const product =
        await this.prisma.product.findUnique({

          where: {
            id: item.productId,
          },
        });

      if (!product) continue;

      await this.prisma.saleItem.create({

        data: {

          saleId:
            sale.id,

          productId:
            product.id,

          quantity:
            item.quantity,

          price:
            product.price,
        },
      });

      // UPDATE STOCK
      await this.prisma.product.update({

        where: {
          id: product.id,
        },

        data: {

          stock: {

            decrement:
              item.quantity,
          },
        },
      });
    }

    return sale;
  }

  // GET SALES
  async findAll(
    businessId: string,
  ) {

    return this.prisma.sale.findMany({

      where: {

        businessId,
      },

      include: {

        items: {

          include: {

            product: true,
          },
        },

        cashier: true,
      },

      orderBy: {

        createdAt:
          'desc',
      },
    });
  }
}