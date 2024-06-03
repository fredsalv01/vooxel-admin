import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @IsString()
  @IsOptional()
  table_name: string;

  @IsInt()
  @IsOptional()
  tableId: number;

  @IsString()
  @IsOptional()
  tag: string;

  @IsString()
  @IsOptional()
  keyFile: string;

  @IsString()
  @IsOptional()
  path: string;
}
