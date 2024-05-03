import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ContractType, DocumentType } from '../utils/enum-types';
import { PaginationDto } from '../../pagination/dto/pagination.dto';

export class filterWorkersPaginatedDto extends PaginationDto {
  @IsString()
  @IsOptional()
  input?: string;
}
