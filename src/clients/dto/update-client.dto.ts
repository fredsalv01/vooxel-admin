import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { isUnique, methodEnum } from 'src/validation/isUnique.constraint';

export class UpdateClientDto {
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
    description: 'direccion del cliente',
    example: 'Calle Avenida La Paz 125, Lima',
  })
  @IsString()
  @IsOptional()
  address: string;

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
