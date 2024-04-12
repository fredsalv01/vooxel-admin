import { Controller, Get, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Request request) {
    const token = this.authService.getJwtToken(request);
    return token;
  }

  @Get()
  getProfile(@Request request) {
    return request.user;
  }
}
