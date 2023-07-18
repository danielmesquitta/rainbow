import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { CreateUserDTO } from '~/users/dtos/create-user-dto';
import { allowedColors } from '../constants/allowed-colors';

type CreateUserServiceData = CreateUserDTO;

@Injectable()
export class CreateUserService {
  constructor(private readonly db: DatabaseService) {}

  async execute({
    document,
    email,
    favoriteColor,
    ...data
  }: CreateUserServiceData) {
    /**
     * Validate if document is unique
     */
    const documentExists = await this.db.user.findUnique({
      where: { document },
    });

    if (documentExists) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este CPF',
      );
    }

    /**
     * Validate if email is unique
     */
    const formattedEmail = email.toLowerCase();

    const emailExists = await this.db.user.findUnique({
      where: { email: formattedEmail },
    });

    if (emailExists) {
      throw new BadRequestException(
        'Já existe um usuário cadastrado com este e-mail',
      );
    }

    /**
     * Validate if favorite color is allowed
     */
    const formattedFavoriteColor = favoriteColor.toUpperCase();

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

    const user = await this.db.user.create({
      data: {
        document,
        email: formattedEmail,
        favoriteColor: formattedFavoriteColor,
        ...data,
      },
    });

    return user;
  }
}
