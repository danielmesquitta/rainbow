import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { addHours } from 'date-fns';
import { expiresInHoursOptions } from '../constants/expire-in-hours-options.constant';
import { TokenType } from '../constants/token-type.constant';

export interface GenerateJWTTokenServiceData {
  userId: string;
  payload: Record<string, any>;
  type: TokenType;
}

@Injectable()
export class GenerateJWTTokenService {
  constructor(private readonly jwtService: JwtService) {}

  async execute({ userId, payload, type }: GenerateJWTTokenServiceData) {
    const expiresInHours = expiresInHoursOptions[type];

    const token = await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: process.env[`JWT_${type}_SECRET`],
        expiresIn: `${expiresInHours}h`,
      },
    );

    const expiresAt = Number(addHours(new Date(), expiresInHours));

    return {
      token,
      expiresAt,
    };
  }
}
