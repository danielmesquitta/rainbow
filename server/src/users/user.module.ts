import { Module } from '@nestjs/common';
import { PaginateService } from '~/common/services/paginate.service';
import { DatabaseService } from '~/database/services/database.service';
import { CreateUserService } from './services/create-user.service';
import { GetUserService } from './services/get-user.service';
import { ListUsersService } from './services/list-users.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';

const userServices = [
  CreateUserService,
  UpdateUserService,
  GetUserService,
  ListUsersService,
];

@Module({
  controllers: [UserController],
  providers: [...userServices, DatabaseService, PaginateService],
})
export class UserModule {}
