import { IsBoolean, IsEmail, IsOptional, Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated.constraint';
import { isUnique } from '../../validation/isUnique.constraint';

export class CreateUserDto {
  @Length(5)
  @isUnique({ tableName: 'user', column: 'username', method: 'create' })
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
  @isUnique({ tableName: 'user', column: 'email', method: 'create' })
  email: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
