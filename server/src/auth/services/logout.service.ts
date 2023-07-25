import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';

export type LogoutServiceData = {
  userId: string;
};

@Injectable()
export class LogoutService {
  constructor(private readonly db: DatabaseService) {}

  async execute({ userId }: LogoutServiceData) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

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
