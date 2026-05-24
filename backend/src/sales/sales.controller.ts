import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { SalesService }
from './sales.service';

@Controller('sales')

export class SalesController {

  constructor(

    private readonly salesService:
      SalesService,
  ) {}

  // CREATE SALE
  @Post()

  create(
    @Body()
    body: any,
  ) {

    return this.salesService.create(
      body,
    );
  }

  // GET SALES
  @Get()

  findAll() {

    return this.salesService.findAll(
      '',
    );
  }
}