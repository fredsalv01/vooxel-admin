import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated.constraint';
import { UserDoesNotExist } from '../validation/user-does-not-exists.constraint';

export class CreateUserDto {
  @Length(5)
  @UserDoesNotExist({
    context: 'create',
  })
  username: string;

  @Length(8)
  password: string;

  @Length(8)
  @IsRepeated('password')
  retypedPassword: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  @UserDoesNotExist({
    context: 'create',
  })
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
