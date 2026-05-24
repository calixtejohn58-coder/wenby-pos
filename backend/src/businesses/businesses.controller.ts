import {
  Controller,
  Get,
  Patch,
  Param,
} from '@nestjs/common';

import { BusinessesService }
from './businesses.service';

@Controller('businesses')

export class BusinessesController {

  constructor(

    private businessesService:
      BusinessesService,
  ) {}

  @Get()

  findAll() {

    return this.businessesService.findAll();
  }

  @Patch(':id/suspend')

  suspend(
    @Param('id')
    id: string,
  ) {

    return this.businessesService.suspend(
      id,
    );
  }
}