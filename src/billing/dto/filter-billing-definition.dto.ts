import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { DateRange, OrderData } from '../interface';
import { ApiProperty } from '@nestjs/swagger';

export class FiltersBillingDto extends PaginationDto {
  constructor() {
    super();
  }

  @ApiProperty({
    description: 'año de la factura',
    example: [2021, 2022],
  })
  @IsArray({ each: true, message: 'year debe ser un array de numeros' })
  @IsOptional()
  year?: number[];

  @ApiProperty({
    description: 'mes de la factura',
    example: [1, 2, 3],
  })
  @IsArray({ each: true, message: 'months debe ser un array de numeros' })
  @IsOptional()
  month?: number[];

  @ApiProperty({
    description: 'tipo de cambio de la factura',
    example: ['SOLES', 'DOLARES'],
  })
  @IsArray({ each: true, message: 'currency debe ser un array de strings' })
  @IsOptional()
  currency?: string[];

  @ApiProperty({
    description: 'estado de la factura',
    example: 'PENDIENTE',
  })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({
    description: 'tipo de servicio',
    example: ['CONSULTORIA', 'CAPACITACION'],
  })
  @IsArray({
    each: true,
    message: 'Los tipos de servicio son un array de strings',
  })
  @IsOptional()
  service: string[];

  @ApiProperty({
    description: 'cliente de la factura',
    example: ['Empresa 1', 'Empresa 2'],
  })
  @IsArray({
    each: true,
    message: 'Los clientes deben ser un array de strings',
  })
  @IsOptional()
  client: string[];

  @ApiProperty({
    description: 'rango de fechas',
    example: [
      {
        column: 'start_date',
        start_date: '2021-01-01',
        end_date: '2021-12-31',
      },
    ],
  })
  @IsObject({ each: true, message: 'Las fechas deben ser un array de objetos' })
  @IsOptional()
  dates?: DateRange[];

  @ApiProperty({
    description: 'orden de la factura',
    example: { column: 'id', direction: 'ASC' },
  })
  @IsObject({ each: true, message: 'El orden debe ser un objeto' })
  @IsOptional()
  order?: OrderData = { column: 'id', direction: 'ASC' };
}
