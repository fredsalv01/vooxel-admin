import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  table_name: string;

  @IsInt()
  @IsNotEmpty()
  tableId: number;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsString()
  @IsNotEmpty()
  keyFile: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}
