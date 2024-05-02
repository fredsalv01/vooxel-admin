import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardLocal } from '../guards/auth-guard-local.guard';
import { AuthService } from '../services/auth.service';
import { AuthGuardJwt } from '../guards/auth-guard-jwt.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from '../dto/login-user.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@Body() loginUserDto: LoginUserDto, @CurrentUser() user) {
    this.logger.log('Using route: ', this.login.name);

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

  @Post('refresh')
  refresh(@Body('token') token: string) {
    return this.authService.refresh(token);
  }
}
