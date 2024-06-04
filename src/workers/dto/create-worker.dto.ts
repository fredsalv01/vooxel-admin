import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContactDto } from './create-emergencyContact.dto';
import { ApiProperty } from '@nestjs/swagger';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';
import { dateFormatValidator } from '../../common/functions';

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
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  birthdate: string; // fecha de nacimiento

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
}
