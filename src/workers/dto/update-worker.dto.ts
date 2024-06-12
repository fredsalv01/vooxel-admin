import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { DocumentType, EnglishLevel } from '../utils/enum-types';
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
  englishLevel?: EnglishLevel;
  charge?: string;
  techSkills?: string[];
  familiarAssignment?: string;

  @IsNumber()
  @IsOptional()
  chiefOfficerId?: number;

  @IsNumber()
  @IsOptional()
  clientId?: number;
}
