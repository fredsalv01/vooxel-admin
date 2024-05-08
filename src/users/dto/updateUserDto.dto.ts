import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto.dto';
import { IsEmail, Length } from 'class-validator';
import { isUnique } from '../../validation/isUnique.constraint';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(5)
  @isUnique({ tableName: 'user', column: 'username', method: 'update' })
  username?: string;
  firstName?: string;
  lastName?: string;
  @IsEmail()
  @isUnique({ tableName: 'user', column: 'email', method: 'update' })
  email?: string;
  password?: string;
  retypedPassword?: string;
  isActive?: boolean;
}
