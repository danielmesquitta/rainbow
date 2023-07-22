import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsPublic } from './decorators/is-public.decorator';
import { LoggedInUser } from './decorators/logged-in-user.decorator';
import { LoginDTO } from './dtos/login.dto';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { LoginService } from './services/login.service';
import { LogoutService } from './services/logout.service';
import { RefreshTokenService } from './services/refresh-token.service';

@ApiTags('Auth')
@Controller({ path: '/auth' })
export class AuthController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logoutService: LogoutService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  @Post('/login')
  @IsPublic()
  @ApiOperation({
    summary: 'Use e-mail and password to log-in',
  })
  async login(@Body() data: LoginDTO) {
    return this.loginService.execute(data);
  }

  @Post('/logout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Log-out',
  })
  logout(@LoggedInUser() { id }: Pick<User, 'id'>) {
    this.logoutService.execute({ userId: id });
  }

  @Post('/refresh')
  @IsPublic()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({
    summary: 'Use refresh token to get new access token and refresh token',
    description:
      '- The refresh token must be sent in the header as a bearer token',
  })
  refreshTokens(
    @LoggedInUser() { id, refreshToken }: Pick<User, 'id' | 'refreshToken'>,
  ) {
    return this.refreshTokenService.execute({
      userId: id,
      refreshToken: refreshToken!,
    });
  }
}
