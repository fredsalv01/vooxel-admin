import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class GetFilesDto {
  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsString()
  @IsNotEmpty()
  tag: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @Type(() => Number)
  tableId: number;
}
