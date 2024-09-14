import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateContactDto {
  @ApiProperty({
    description: 'Nombre del Contacto',
    example: 'Jhon Doe',
  })
  @IsString()
  @IsOptional()
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
}
