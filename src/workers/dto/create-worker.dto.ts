import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';
import { ApiProperty } from '@nestjs/swagger';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @IsString()
  // @WorkerDoesNotExists()
  @isUnique({
    tableName: 'worker',
    column: 'documentNumber',
    method: methodEnum.create,
  })
  @IsNotEmpty()
  documentNumber: string; // numero de documento MAX: 9 MIN: 8

  @IsNotEmpty()
  @IsString()
  apPat: string; // apellido paterno

  @IsNotEmpty()
  @IsString()
  apMat: string; // apellido materno

  @IsNotEmpty()
  @IsString()
  name: string; // nombre

  @IsNotEmpty()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel; // nivel de ingles enum: [INTERMEDIO, AVANZADO, NATIVO, BASICO]

  @IsNotEmpty()
  @IsString()
  charge: string; // cargo

  @ApiProperty({
    description: 'birthDate',
    example: '1998-07-13',
  })
  @IsDateString({ strict: true } as any)
  @IsNotEmpty()
  birthdate: string; // fecha de nacimiento

  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]

  @ApiProperty({
    description: 'hiringDate',
    example: '2024-05-05',
  })
  @IsDateString({ strict: true } as any)
  @IsNotEmpty()
  hiringDate: string; // fecha de inicio de contrato

  @IsNotEmpty()
  @IsString()
  phoneNumber: string; // numero de telefono cel o telefono

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsNotEmpty()
  familiarAssignment: string;

  @IsArray()
  @IsNotEmpty()
  techSkills: string[]; // string[]

  @IsArray({
    each: false,
    context: EmergencyContactDto,
  })
  @IsOptional()
  emergencyContacts?: EmergencyContactDto[];

  // @IsEmpty()
  // @IsNumber()
  // chiefOfficerId?: number | null; // aca vamos a hacer una asignacion circular en bd
}
