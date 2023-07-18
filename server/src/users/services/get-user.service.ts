import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { GetUserParamsDTO } from '../dtos/get-user-params-dto';

type GetUserServiceData = GetUserParamsDTO;

@Injectable()
export class GetUserService {
  constructor(private readonly db: DatabaseService) {}

  async execute({ userId }: GetUserServiceData) {
    /**
     * Validate if user exists
     */
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
