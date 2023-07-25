import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAccessAuthGuard } from './auth/guards/jwt-access-auth.guard';
import { UserModule } from './users/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
  ],
})
export class AppModule {}
