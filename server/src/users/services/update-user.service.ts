import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { allowedColors } from '~/users/constants/allowed-colors';
import { UpdateUserDTO } from '~/users/dtos/update-user-dto';
import { UpdateUserParamsDTO } from '~/users/dtos/update-user-params-dto';
import { UserEntity } from '../user.entity';

type UpdateUserServiceData = UpdateUserDTO & UpdateUserParamsDTO;

@Injectable()
export class UpdateUserService {
  constructor(private readonly db: DatabaseService) {}

  async execute({
    userId,
    document,
    email,
    favoriteColor,
    ...data
  }: UpdateUserServiceData) {
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
     * If is updating document, validate if document is unique
     */
    if (document && document !== user.document) {
      const documentExists = await this.db.user.findUnique({
        where: { document },
      });

      if (documentExists) {
        throw new BadRequestException(
          'Já existe um usuário cadastrado com este CPF',
        );
      }
    }

    /**
     * If is updating email, validate if email is unique
     */
    let formattedEmail: string;

    if (email && email !== user.email) {
      formattedEmail = email.toLowerCase();

      const emailExists = await this.db.user.findUnique({
        where: { email: formattedEmail },
      });

      if (emailExists) {
        throw new BadRequestException(
          'Já existe um usuário cadastrado com este e-mail',
        );
      }
    }

    /**
     * If is updating favorite color, validate if favorite color is allowed
     */
    let formattedFavoriteColor: string;

    if (favoriteColor) {
      formattedFavoriteColor = favoriteColor.toUpperCase();

      const allowedColorHexes = Object.values(allowedColors);

      if (
        !allowedColorHexes.includes(
          formattedFavoriteColor as (typeof allowedColorHexes)[0],
        )
      ) {
        throw new BadRequestException(
          'A sua cor favorita deve ser uma das cores do arco-íris',
        );
      }
    }

    const updatedUser = await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        document,
        email: formattedEmail,
        favoriteColor: formattedFavoriteColor,
        ...data,
      },
    });

    return new UserEntity(updatedUser);
  }
}
