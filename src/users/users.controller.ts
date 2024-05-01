import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuardJwt } from '../auth/guards/auth-guard-jwt.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @HttpCode(201)
  async AddUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.register(createUserDto);
    const token = this.authService.getJwtToken(user);
    return {
      user,
      token,
    };
  }

  @Post('reset-password')
  @UseGuards(AuthGuardJwt)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @CurrentUser() user,
  ) {
    return this.usersService.resetPassword(resetPasswordDto, user);
  }

  @Get()
  @HttpCode(200)
  async getUsers(@Query('isActive') isActive: boolean) {
    const users = await this.usersService.getUsers(isActive);
    return users;
  }
}
