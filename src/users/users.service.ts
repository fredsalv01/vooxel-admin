import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto.dto';

@Injectable()
export class UsersService {
  async register(createUserDto: CreateUserDto) {
    const data = createUserDto;
    return `User ${data.firstName} has been registered`;
  }
}
