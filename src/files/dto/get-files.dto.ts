import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { FileTypes } from '../enum/enum-type';

export class GetFilesDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsEnum(FileTypes, {
    message: `Los tipos de tag validos son: ${Object.values(FileTypes)}`,
  })
  @IsNotEmpty()
  tag: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  tableId: number;
}
