import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDTO } from './dtos/create-user-dto';
import { GetUserParamsDTO } from './dtos/get-user-params-dto';
import { ListUsersQueryDTO } from './dtos/list-users-query.dto';
import { UpdateUserDTO } from './dtos/update-user-dto';
import { UpdateUserParamsDTO } from './dtos/update-user-params-dto';
import { CreateUserService } from './services/create-user.service';
import { GetUserService } from './services/get-user.service';
import { ListUsersService } from './services/list-users.service';
import { UpdateUserService } from './services/update-user.service';

@ApiTags('Users')
@Controller({ path: '/users' })
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly getUserService: GetUserService,
    private readonly listUsersService: ListUsersService,
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

  @Get('/:userId')
  @ApiOperation({
    summary: 'Get user',
  })
  get(@Body() params: GetUserParamsDTO) {
    return this.getUserService.execute(params);
  }

  @Get('/')
  @ApiOperation({
    summary: 'List users',
  })
  list(@Query() query: ListUsersQueryDTO) {
    return this.listUsersService.execute(query);
  }
}
