import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { UpdateUserDTO } from '~/users/dtos/update-user-dto';
import { allowedColors } from '../constants/allowed-colors';
import { UpdateUserParamsDTO } from '../dtos/update-params-dto';

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

    if (email) {
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
          `A cor favorita deve ser uma das cores do arco-íris`,
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

    return updatedUser;
  }
}
