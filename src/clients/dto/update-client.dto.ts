import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { isUnique, methodEnum } from 'src/validation/isUnique.constraint';

export class UpdateClientDto {
  @ApiProperty({
    description: 'Nombre del representante legal del cliente',
    example: 'Juan Perez',
  })
  @IsString()
  @IsOptional()
  fullName: string;

  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Grupo Systems V&V',
  })
  @IsString()
  @IsOptional()
  businessName: string;

  @ApiProperty({
    description: 'RUC del cliente',
    example: '20604331430',
  })
  @IsString()
  @isUnique({
    column: 'ruc',
    method: methodEnum.update,
    tableName: 'client',
  })
  @IsOptional()
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
  @IsOptional()
  contractStartDate: Date;

  @ApiProperty({
    description: 'fecha de fin del contrato del cliente',
    example: '2024-07-13',
  })
  @Validate(dateFormatValidator) // Custom validation
  @IsOptional()
  contractEndDate: Date;

  @IsBoolean()
  @ApiProperty({
    description: 'el elemento esta activo o no',
    example: true,
  })
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  isActive?: boolean;
}

function dateFormatValidator(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(value);
  return !isNaN(date.getTime());
}
