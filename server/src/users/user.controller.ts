import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dtos/create-user-dto';
import { CreateUserService } from './services/create-user.service';

@ApiTags('Users')
@Controller({ path: '/users' })
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create user',
  })
  create(@Body() data: CreateUserDTO) {
    return this.createUserService.execute(data);
  }
}
