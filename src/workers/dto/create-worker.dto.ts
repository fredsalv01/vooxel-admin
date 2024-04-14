import {
  IsArray,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { EmergencyContactDto } from './create-emergencyContact.dto';

export class CreateWorkerDto {
  @IsNotEmpty()
  @IsEnum(DocumentType)
  documentType: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @IsNotEmpty()
  @IsNumber()
  documentNumber: number; // numero de documento MAX: 9 MIN: 8

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

  @IsDateString({ strict: true } as any)
  @IsNotEmpty()
  birthdate: string; // fecha de nacimiento

  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]

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
  emergencyContacts?: EmergencyContactDto[];

  // @IsEmpty()
  // @IsNumber()
  // chiefOfficerId?: number | null; // aca vamos a hacer una asignacion circular en bd
}
