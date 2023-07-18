import { Module } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { CreateUserService } from './services/create-user.service';
import { GetUserService } from './services/get-user.service';
import { UpdateUserService } from './services/update-user.service';
import { UserController } from './user.controller';

const userServices = [CreateUserService, UpdateUserService, GetUserService];

@Module({
  controllers: [UserController],
  providers: [...userServices, DatabaseService],
})
export class UserModule {}
