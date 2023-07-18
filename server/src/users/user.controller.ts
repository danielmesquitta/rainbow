import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dtos/create-user-dto';
import { UpdateUserParamsDTO } from './dtos/update-params-dto';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { CreateUserService } from './services/create-user.service';
import { UpdateUserService } from './services/update-user.service';

@ApiTags('Users')
@Controller({ path: '/users' })
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create user',
  })
  create(@Body() data: CreateUserDTO) {
    return this.createUserService.execute(data);
  }

  @Put('/:userId')
  @ApiOperation({
    summary: 'Update user',
  })
  update(@Body() params: UpdateUserParamsDTO, @Body() data: UpdateUserDTO) {
    return this.updateUserService.execute({
      ...params,
      ...data,
    });
  }
}
