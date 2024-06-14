import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import {
  DocumentType,
  EnglishLevel,
  Seniority,
  WorkerStatus,
} from '../utils/enum-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';
import { CreateCertificationDto } from './create-certification.dto';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBankAccountDto } from './create-bank-account.dto';
import { isUnique, methodEnum } from 'src/validation/isUnique.constraint';
import { dateFormatValidator } from 'src/common/functions';

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
  email?: string;
  province?: string;
  department?: string;
  district?: string;
  address?: string;
  englishLevel?: EnglishLevel;
  charge?: string;

  @ApiProperty({
    description: 'seniority del trabajador',
    example: Seniority.SENIOR,
  })
  @IsOptional()
  @IsEnum(Seniority)
  seniority?: Seniority;

  @IsOptional()
  @Validate(dateFormatValidator)
  startDate?: string;

  @IsOptional()
  @Validate(dateFormatValidator)
  endDate?: string;

  @ApiProperty({
    description: 'estado del trabajador',
    example: WorkerStatus.LABORANDO,
  })
  @IsOptional()
  @IsEnum(WorkerStatus)
  workerStatus?: WorkerStatus;

  techSkills?: string[];
  familiarAssignment?: string;

  @IsNumber()
  @IsOptional()
  chiefOfficerId?: number;

  @IsNumber()
  @IsOptional()
  clientId?: number;
}
