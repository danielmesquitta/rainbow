import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  name: string;
  email: string;
  document: string;
  favoriteColor: string;
  observations: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  searchableName: string;
  @Exclude()
  password: string;
  @Exclude()
  refreshToken: string;

  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
}
