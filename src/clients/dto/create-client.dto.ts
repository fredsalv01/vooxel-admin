import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';

export class CreateClientDto {
  @ApiProperty({
    description: 'Nombre del representante legal del cliente',
    example: 'Juan Perez',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Grupo Systems V&V',
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    description: 'RUC del cliente',
    example: '20604331430',
  })
  @IsString()
  @isUnique({
    column: 'ruc',
    method: methodEnum.create,
    tableName: 'client',
  })
  @IsNotEmpty()
  ruc: string;

  @ApiProperty({
    description: 'Telefono del cliente',
    example: '+51980036637',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'email del cliente',
    example: 'email@email.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'fecha de inicio del contrato del cliente',
    example: '2023-07-13',
  })
  @Validate(dateFormatValidator) // Custom validation
  @IsNotEmpty()
  contractStartDate: Date;

  @ApiProperty({
    description: 'fecha de fin del contrato del cliente',
    example: '2024-07-13',
  })
  @Validate(dateFormatValidator) // Custom validation
  @IsNotEmpty()
  contractEndDate: Date;
}

function dateFormatValidator(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
}
