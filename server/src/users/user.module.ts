import { Module } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { CreateUserService } from './services/create-user.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  exports: [CreateUserService],
  providers: [CreateUserService, DatabaseService],
})
export class UserModule {}
