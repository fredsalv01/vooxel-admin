import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @IsNotEmpty()
  @IsNumber()
  documentNumber: number; // numero de documento MAX: 9 MIN: 8

  @IsNotEmpty()
  @IsString()
  ApPat: string; // apellido paterno

  @IsNotEmpty()
  @IsString()
  ApMat: string; // apellido materno

  @IsNotEmpty()
  @IsString()
  Name: string; // nombre

  @IsNotEmpty()
  @IsEnum(EnglishLevel)
  englishLevel: EnglishLevel; // nivel de ingles enum: [INTERMEDIO, AVANZADO, NATIVO, BASICO]

  @IsNotEmpty()
  @IsString()
  charge: string; // cargo

  @IsDate()
  @IsNotEmpty()
  birthdate: string; // fecha de nacimiento

  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]

  @IsDate()
  @IsNotEmpty()
  hiringDate: Date; // fecha de inicio de contrato

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
  familiarAssingment: string;

  @IsArray()
  @IsNotEmpty()
  techSkills: string[]; // string[]

  @IsNumber()
  @IsNotEmpty()
  chiefOfficerId: number; // aca vamos a hacer una asignacion circular en bd
}
