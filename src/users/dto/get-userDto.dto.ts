import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';

export class getUserDto extends PaginationDto {
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  isActive?: boolean;
}
