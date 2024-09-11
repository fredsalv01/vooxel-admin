import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
// import { Transform } from 'class-transformer';

export class filterBillingPaginatedDto extends PaginationDto {
  @IsString()
  @IsOptional()
  input?: string;

  // TODO: VALIDATE hasHES AND hasIGV

  // @IsBoolean()
  // @Transform(({ obj, key }) => {
  //   return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  // })
  // @IsNotEmpty()
  // isActive: boolean;
}
