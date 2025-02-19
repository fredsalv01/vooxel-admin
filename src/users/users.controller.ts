import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { UsersService } from './users.service';
import { AuthService } from '../auth/services/auth.service';
import { AuthGuardJwt } from '../auth/guards/auth-guard-jwt.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CurrentUser } from '../decorators/current-user.decorator';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../auth/entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(AuthGuardJwt)
  @HttpCode(201)
  async AddUser(@Body() createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = await this.usersService.register(createUserDto);
    return user;
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
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  async getUsers(@Query('isActive') isActive: boolean) {
    const users = await this.usersService.getUsers(isActive);
    return users;
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateOne(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(200)
  async activeOrInactiveUser(@Param('id') id: string) {
    return await this.usersService.remove(+id);
  }
}
