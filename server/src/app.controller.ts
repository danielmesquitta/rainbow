import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from './auth/decorators/is-public.decorator';

@ApiTags('Health Check')
@Controller({ path: '/' })
export class AppController {
  constructor() {}

  @Get('/')
  @IsPublic()
  async index() {
    return 'Api is running!';
  }
}
