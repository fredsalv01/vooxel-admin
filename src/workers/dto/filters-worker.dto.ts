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
  documentType?: DocumentType[];

  @ApiProperty({
    description: 'nivel de ingles del trabajador',
    example: [EnglishLevel.INTERM],
  })
  englishLevel?: EnglishLevel[];

  @ApiProperty({
    description: 'cargo del trabajador',
    example: 'Desarrollador',
  })
  charge?: string;

  @ApiProperty({
    description: 'seniority del trabajador',
    example: [Seniority.JUNIOR],
  })
  seniority?: Seniority[];

  @ApiProperty({
    description: 'distrito del trabajador',
    example: 'San Miguel',
  })
  district?: string;

  @ApiProperty({
    description: 'provincia del trabajador',
    example: 'Lima',
  })
  province?: string;

  @ApiProperty({
    description: 'departamento del trabajador',
    example: 'Lima',
  })
  department?: string;

  @ApiProperty({
    description: 'asignacion familiar del trabajador',
    example: 'SI',
  })
  familiarAssignment?: string;

}
