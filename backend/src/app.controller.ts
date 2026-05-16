import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';

import { AppService } from './app.service';

import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('backup')
  backupDatabase(
    @Res() res,
  ) {
    const filePath =
      'backup.json';

    const data = {
      message:
        'Wenby POS Backup',

      date: new Date(),

      backup: true,
    };

    fs.writeFileSync(
      filePath,

      JSON.stringify(
        data,
        null,
        2,
      ),
    );

    return res.download(
      filePath,
    );
  }
}