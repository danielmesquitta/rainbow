import { ForbiddenException, Injectable } from '@nestjs/common';
import { DatabaseService } from '~/database/services/database.service';
import { TokenType } from '../constants/token-type.constant';
import { CompareWithHashService } from './compare-with-hash.service';
import { GenerateJWTTokenService } from './generate-jwt-token.service';
import { HashService } from './hash.service';

export type RefreshTokenServiceData = {
  userId: string;
  refreshToken: string;
};

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly db: DatabaseService,
    private readonly generateJWTTokenService: GenerateJWTTokenService,
    private readonly compareWithHashService: CompareWithHashService,
    private readonly hashService: HashService,
  ) {}

  async execute({ userId, refreshToken }: RefreshTokenServiceData) {
    /**
     * Check if user exists and
     * if is not logged out
     */
    const user = await this.db.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Refresh token inválido');

    /**
     * Check if refresh token is valid
     */
    const refreshTokenMatches = await this.compareWithHashService.execute({
      hashedText: user.refreshToken,
      text: refreshToken,
    });

    if (!refreshTokenMatches)
      throw new ForbiddenException('Refresh token inválido');

    /**
     * Generate new access and refresh tokens
     */
    const [accessToken, newRefreshToken] = await Promise.all([
      this.generateJWTTokenService.execute({
        userId: user.id,
        payload: user,
        type: TokenType.ACCESS,
      }),

      this.generateJWTTokenService.execute({
        userId: user.id,
        payload: user,
        type: TokenType.REFRESH,
      }),
    ]);

    /**
     * Hash new refresh token
     */
    const hashedRefreshToken = await this.hashService.execute({
      text: newRefreshToken.token,
    });

    /**
     * Store new refresh token in database
     */
    await this.db.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
