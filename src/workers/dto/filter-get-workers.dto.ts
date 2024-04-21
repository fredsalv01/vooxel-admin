import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ContractType, DocumentType } from '../utils/enum-types';
import { PaginationDto } from "../../pagination/dto/pagination.dto";

export class filterWorkersPaginatedDto extends PaginationDto {
  @IsEnum(DocumentType)
  @IsOptional()
  documentType?: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @IsNumber()
  @IsPositive()
  @IsOptional()
  documentNumber?: number; // numero de documento MAX: 9 MIN: 8

  @IsString()
  @IsOptional()
  apPat?: string; // apellido paterno

  @IsString()
  @IsOptional()
  apMat?: string; // apellido materno

  @IsString()
  @IsOptional()
  name?: string; // nombre

  @IsString()
  @IsOptional()
  charge?: string; // cargo

  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsString()
  @IsOptional()
  techSkills?: string;
}
