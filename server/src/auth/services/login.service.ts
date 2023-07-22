import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { TokenType } from '../constants/token-type.constant';
import { LoginDTO } from '../dtos/login.dto';
import { CompareWithHashService } from './compare-with-hash.service';
import { GenerateJWTTokenService } from './generate-jwt-token.service';
import { HashService } from './hash.service';

export type LoginServiceData = LoginDTO;

@Injectable()
export class LoginService {
  constructor(
    private readonly db: DatabaseService,
    private readonly generateJWTTokenService: GenerateJWTTokenService,
    private readonly compareWithHashService: CompareWithHashService,
    private readonly hashService: HashService,
  ) {}

  async execute({ email, password }: LoginServiceData) {
    email = email.toLowerCase();

    /**
     * Check if user exists
     */
    const user = await this.db.user.findUnique({
      where: { email },
    });

    if (!user) throw new BadRequestException('E-mail ou senha incorretos');

    if (!user.password)
      throw new BadRequestException('Usuário não possui permissão');

    /**
     * Check if password is correct
     */
    const passwordMatches = await this.compareWithHashService.execute({
      hashedText: user.password,
      text: password,
    });

    if (!passwordMatches)
      throw new BadRequestException('Senha ou e-mail incorretos');

    /**
     * Generate new access and refresh tokens
     */
    const { password: _, ...payload } = user;

    const [accessToken, refreshToken] = await Promise.all([
      this.generateJWTTokenService.execute({
        userId: user.id,
        payload,
        type: TokenType.ACCESS,
      }),

      this.generateJWTTokenService.execute({
        userId: user.id,
        payload,
        type: TokenType.REFRESH,
      }),
    ]);

    /**
     * Hash refresh token
     */
    const hashedRefreshToken = await this.hashService.execute({
      text: refreshToken.token,
    });

    /**
     * Store new refresh token in database
     */
    const updatedUser = await this.db.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    const { password: __, refreshToken: ___, ...formattedUser } = updatedUser;

    return {
      accessToken,
      refreshToken,
      user: formattedUser,
    };
  }
}
