import { IsRepeated } from '../../validation/is-repeated.constraint';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  password: string;

  @IsString()
  @IsRepeated('password')
  retypedPassword: string;
}
