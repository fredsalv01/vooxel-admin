
import { IsRepeated } from "../../validation/is-repeated.constraint";
import {
  Length,
} from "class-validator";

export class ResetPasswordDto {
  @Length(8)
  password: string;

  @Length(8)
  @IsRepeated('password')
  retypedPassword: string;
}
