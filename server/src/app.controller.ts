import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller({ path: '/' })
export class AppController {
  constructor() {}

  @Get('/')
  async index() {
    return 'Api is running!';
  }
}
