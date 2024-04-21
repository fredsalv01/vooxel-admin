import { IsString, Min } from 'class-validator';

export class PaginationDto {
  @IsString()
  page: string;

  @IsString()
  limit: string;
}
