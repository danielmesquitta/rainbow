import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { DatabaseService } from '~/database/services/database.service';
import { CompareWithHashService } from './services/compare-with-hash.service';
import { GenerateJWTTokenService } from './services/generate-jwt-token.service';
import { HashService } from './services/hash.service';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { JwtAccessStrategy, JwtRefreshStrategy } from './strategies';

const authServices = [
  CompareWithHashService,
  GenerateJWTTokenService,
  HashService,
  LoginService,
  LogoutService,
  RefreshTokenService,
];

@Module({
  controllers: [AuthController],
  exports: authServices,
  imports: [JwtModule.register({})],
  providers: [
    ...authServices,
    DatabaseService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
