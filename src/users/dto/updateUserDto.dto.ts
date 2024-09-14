import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @Length(5)
  @isUnique({
    tableName: 'user',
    column: 'username',
    method: methodEnum.update,
  })
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  @isUnique({ tableName: 'user', column: 'email', method: methodEnum.update })
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
  @IsOptional()
  isActive?: boolean;
}
