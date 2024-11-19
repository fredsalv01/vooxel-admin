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
    example: [2021],
  })
  @IsOptional()
  year?: number[];

  @ApiProperty({
    description: 'mes de la factura',
    example: [1],
  })
  @IsOptional()
  month?: string[];

  @ApiProperty({
    description: 'tipo de cambio de la factura',
    example: ['SOLES', 'DOLARES'],
  })
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
  @IsOptional()
  serviceNames: string[];

  @ApiProperty({
    description: 'cliente de la factura',
    example: ['Empresa 1', 'Empresa 2'],
  })
  @IsOptional()
  client?: string[];

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
  @IsOptional()
  dates?: DateRanges[];

  // @ApiProperty({
  //   description: 'orden de la factura',
  //   example: { column: 'id', direction: 'ASC' },
  // })
  // @IsObject({ each: true, message: 'El orden debe ser un objeto' })
  // @IsOptional()
  // order?: OrderData = { column: 'id', direction: 'ASC' };
}

class DateRanges {
  @IsOptional()
  @IsString()
  column?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;
}
