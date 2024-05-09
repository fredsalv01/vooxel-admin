import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './createUserDto.dto';
import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { isUnique } from '../../validation/isUnique.constraint';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Length(5)
  @isUnique({ tableName: 'user', column: 'username', method: 'update' })
  username?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsEmail()
  @isUnique({ tableName: 'user', column: 'email', method: 'update' })
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  retypedPassword?: string;

  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  isActive?: boolean;
}
