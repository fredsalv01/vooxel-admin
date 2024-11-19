import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { Transform } from 'class-transformer';
import { FiltersWorkerDto } from './filters-worker.dto';

export class filterWorkersPaginatedDto extends FiltersWorkerDto {
  constructor() {
    super();
  }
  
  @IsOptional()
  paginate?: boolean = true;

  @IsString()
  @IsOptional()
  input?: string;

  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsNotEmpty()
  isActive: boolean;
}
