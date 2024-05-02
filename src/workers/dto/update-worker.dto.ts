import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Certification } from '../entities/certification.entity';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  constructor() {
    super();
  }

  name?: string;
  apPat?: string;
  apMat?: string;
  documentType?: DocumentType;
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
    context: Certification,
  })
  @IsOptional()
  certifications:Certification[];

  @IsDateString({ strict: true } as any)
  @IsOptional()
  leaveDate?: string;

  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  contractUrl?: string;

  @IsString()
  @IsOptional()
  psychologicalTestUrl?: string;
}
