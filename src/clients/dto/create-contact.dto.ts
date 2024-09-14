import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateContactDto {
  @ApiProperty({
    description: 'Nombre del Contacto',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Telefono del contacto',
    example: '+51991107168',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'Email del contacto',
    example: 'jhon.doe@email.com',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({
    description: 'Area designada',
    example: 'Contabilidad',
  })
  @IsString()
  @IsOptional()
  designed_area: string;

  @ApiProperty({
    description: 'Id de cliente',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  clientId: number;
}
