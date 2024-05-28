import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FileTypes } from '../enum/enum-type';

export class GetSignedUrlDto {
  @IsEnum(FileTypes, {
    message: `Los tipos de tag validos son: ${Object.values(FileTypes)}`,
  })
  @IsNotEmpty()
  type: string;
}
