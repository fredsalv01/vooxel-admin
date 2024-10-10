import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isUnique, methodEnum } from '../../validation/isUnique.constraint';

export class CreateClientDto {
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
    description: 'direccion del cliente',
    example: 'Calle Avenida La Paz 125, Lima',
  })
  @IsString()
  @IsOptional()
  address: string;
}
