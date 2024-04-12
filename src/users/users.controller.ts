import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  AddUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }
}
