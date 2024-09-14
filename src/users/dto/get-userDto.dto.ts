import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class getUserDto extends PaginationDto {

  @IsString()
  @IsOptional()
  input?: string;

  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  isActive: boolean;
}
