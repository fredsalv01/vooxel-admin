import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from './utils/functions';

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
      })
    )
  }
}
