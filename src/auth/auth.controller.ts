import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuardLocal } from './guards/auth-guard-local.guard';

@Controller('auth')
export class AuthController {
  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@Request() request) {
    return {
      userId: request.user.id,
      token: 'token will go here',
    };
  }

  @Get()
  getProfile(@Request() request) {
    return request.user;
  }
}
