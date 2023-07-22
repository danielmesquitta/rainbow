import { Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';

export type LogoutServiceData = {
  userId: string;
};

@Injectable()
export class LogoutService {
  constructor(private readonly db: DatabaseService) {}

  async execute({ userId }: LogoutServiceData) {
    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: null,
      },
    });
  }
}
