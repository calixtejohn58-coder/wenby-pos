 import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { ProductsService }
from './products.service';

@Controller('products')

export class ProductsController {

  constructor(

    private readonly productsService:
      ProductsService,
  ) {}

  // CREATE PRODUCT
  @Post()

  create(
    @Body()
    body: any,
  ) {

    return this.productsService.create(
      body,
    );
  }

  // GET PRODUCTS
  @Get()

  findAll() {

    return this.productsService.findAll(
      '',
    );
  }

  // GET ONE PRODUCT
  @Get(':id')

  findOne(
    @Param('id')
    id: string,
  ) {

    return this.productsService.findOne(
      id,
    );
  }

  // UPDATE PRODUCT
  @Put(':id')

  update(

    @Param('id')
    id: string,

    @Body()
    body: any,
  ) {

    return this.productsService.update(

      id,

      body,
    );
  }

  // DELETE PRODUCT
  @Delete(':id')

  remove(
    @Param('id')
    id: string,
  ) {

    return this.productsService.remove(
      id,
    );
  }
}