import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';
import { CreateCertificationDto } from './create-certification.dto';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBankAccountDto } from './create-bank-account.dto';
import { isUnique, methodEnum } from 'src/validation/isUnique.constraint';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  constructor() {
    super();
  }

  name?: string;
  apPat?: string;
  apMat?: string;
  documentType?: DocumentType;
  @isUnique({
    tableName: 'worker',
    column: 'documentNumber',
    method: methodEnum.update,
  })
  documentNumber?: string;
  birthdate?: string;
  phoneNumber?: string;
  province?: string;
  department?: string;
  district?: string;
  address?: string;
  contractType?: ContractType;
  englishLevel?: EnglishLevel;
  charge?: string;
  techSkills?: string[];
  hiringDate?: string;
  emergencyContacts?: EmergencyContactDto[];
  familiarAssignment?: string;

  @IsNumber()
  @IsOptional()
  chiefOfficerId?: number;

  @IsArray({
    each: false,
    context: CreateCertificationDto,
  })
  @IsOptional()
  certifications: CreateCertificationDto[];

  @ApiProperty({
    description: 'leaveDate',
    example: null,
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  leaveDate?: string = null;

  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  contractUrl?: string;

  @IsString()
  @IsOptional()
  psychologicalTestUrl?: string;

  @IsNumber()
  @IsOptional()
  clientId?: number;

  @IsOptional()
  bankAccount?: CreateBankAccountDto;
}

function dateFormatValidator(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
}
