import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';

export class getUserDto extends PaginationDto {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
