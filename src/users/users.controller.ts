import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UsersService } from './users.service';
import { User } from '../auth/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async AddUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.register(createUserDto);
    return user;
  }
}
