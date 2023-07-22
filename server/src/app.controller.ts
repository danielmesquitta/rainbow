import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/' })
export class AppController {
  constructor() {}

  @Get('/')
  async index() {
    return 'Api is running!';
  }
}
