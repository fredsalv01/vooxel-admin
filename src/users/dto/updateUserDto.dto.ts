import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  retypedPassword?: string;
  isActive?: boolean;
}
