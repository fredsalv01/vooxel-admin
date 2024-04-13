import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(201)
  async AddUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.register(createUserDto);
    const token = this.authService.getJwtToken(user);
    return {
      user,
      token
    };
  }
}
