import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import {
  DocumentType,
  EnglishLevel,
  Seniority,
  WorkerStatus,
} from '../utils/enum-types';
import { ApiProperty } from '@nestjs/swagger';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';
import { dateFormatValidator } from '../../common/functions';

export class CreateWorkerDto {
  @ApiProperty({
    description: 'tipo de documento del trabajador',
    example: DocumentType.DNI,
  })
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

  @ApiProperty({
    description: 'Nivel de ingles del trabajador',
    example: EnglishLevel.INTERM,
  })
  @IsNotEmpty()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel; // nivel de ingles enum: [INTERMEDIO, AVANZADO, NATIVO, BASICO]

  @IsNotEmpty()
  @IsString()
  charge: string; // cargo

  @ApiProperty({
    description: 'seniority del trabajador',
    example: Seniority.JUNIOR,
  })
  @IsNotEmpty()
  @IsEnum(Seniority)
  seniority: Seniority;

  @ApiProperty({
    description: 'birthDate',
    example: '1998-07-13',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  birthdate: string; // fecha de nacimiento

  @ApiProperty({
    description: 'startDate',
    example: '2021-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  startDate: string; // fecha de nacimiento

  @ApiProperty({
    description: 'estado del trabajador',
    example: WorkerStatus.PENDIENTE,
  })
  @IsOptional()
  @IsEnum(WorkerStatus)
  workerStatus: WorkerStatus;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string; // numero de telefono cel o telefono

  @IsNotEmpty()
  @IsEmail()
  email: string; // email personal del trabajador

  @IsNotEmpty()
  @IsNumber()
  salary: number; // salario del trabajador

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
  @IsOptional()
  techSkills: string[]; // string[]
}
