import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from './utils/functions';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async register(createUserDto: CreateUserDto) {
    return await this.userRepository.save(
      new User({
        ...createUserDto,
        password: await hashPassword(createUserDto.password),
      }),
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, user: User) {
    const { password } = resetPasswordDto;

    if (!user) {
      throw new NotFoundException({
        error: 'El token no es válido',
      });
    }

    user.password = await hashPassword(password);
    await this.userRepository.save(user);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
