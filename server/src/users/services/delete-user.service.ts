import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { DeleteUserParamsDTO } from '~/users/dtos/delete-user-params-dto';

export type DeleteUserServiceData = DeleteUserParamsDTO;

@Injectable()
export class DeleteUserService {
  constructor(private readonly db: DatabaseService) {}

  async execute({ userId }: DeleteUserServiceData) {
    /**
     * Validate if user exists
     */
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    /**
     * Delete user
     */
    await this.db.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
