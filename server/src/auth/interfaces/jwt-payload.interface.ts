import { User } from '@prisma/client';

export type JwtPayload = User & {
  exp: number;
  iat: number;
};
