import { DocumentType, EnglishLevel, Seniority } from '../utils/enum-types';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class FiltersWorkerDto extends PaginationDto {
  constructor() {
    super();
  }
  
  @ApiProperty({
    description: 'tipo de documento del trabajador',
    example: [DocumentType.DNI],
  })
  @IsOptional()
  documentType: DocumentType[];

  @ApiProperty({
    description: 'numero de documento del trabajador',
    example: '12345678',
  })
  @IsOptional()
  documentNumber: string;

  @ApiProperty({
    description: 'apellido paterno del trabajador',
    example: 'Perez',
  })
  @IsOptional()
  apPat: string;

  @ApiProperty({
    description: 'apellido materno del trabajador',
    example: 'Gomez',
  })
  @IsOptional()
  apMat: string;

  @ApiProperty({
    description: 'nombre del trabajador',
    example: 'Juan',
  })
  name: string;

  @ApiProperty({
    description: 'nivel de ingles del trabajador',
    example: [EnglishLevel.INTERM],
  })
  englishLevel: EnglishLevel[];

  @ApiProperty({
    description: 'cargo del trabajador',
    example: 'Desarrollador',
  })
  charge: string;

  @ApiProperty({
    description: 'seniority del trabajador',
    example: [Seniority.JUNIOR],
  })
  seniority: Seniority[];

  @ApiProperty({
    description: 'distrito del trabajador',
    example: 'San Miguel',
  })
  district: string;

  @ApiProperty({
    description: 'provincia del trabajador',
    example: 'Lima',
  })
  province: string;

  @ApiProperty({
    description: 'departamento del trabajador',
    example: 'Lima',
  })
  department: string;

  @ApiProperty({
    description: 'asignacion familiar del trabajador',
    example: 'SI',
  })
  familiarAssignment: string;

}
