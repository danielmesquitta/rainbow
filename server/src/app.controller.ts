import { Controller, Get, Res } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path';

@Controller({ path: '/' })
export class AppController {
  constructor() {}

  @Get('/')
  async index(@Res() res) {
    res.send('Api is running!');
  }

  @Get('/.well-known/pki-validation/B32A6D76764A8007DFFDFC1A1E6FF51A.txt')
  async get(@Res() res) {
    const filePath = resolve(
      __dirname,
      '..',
      'B32A6D76764A8007DFFDFC1A1E6FF51A.txt',
    );

    const stream = fs.createReadStream(filePath);

    res.type('text/plain').send(stream);
  }
}
