import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardLocal } from '../guards/auth-guard-local.guard';
import { AuthService } from '../services/auth.service';
import { AuthGuardJwt } from '../guards/auth-guard-jwt.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user) {
    return {
      userId: user.id,
      token: this.authService.getJwtToken(user),
    };
  }

  @Get('profile')
  @UseGuards(AuthGuardJwt)
  getProfile(@CurrentUser() user) {
    return user;
  }
}
