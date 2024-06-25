import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { VacationDetailType } from '../enum/vacationDetailType';
import { dateFormatValidator } from '../../common/functions';
import { ApiProperty } from '@nestjs/swagger';

export class VacationDetailItem {
  constructor(partial?: Partial<VacationDetailItem>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'id',
    example: '1',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'vacationId',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  vacationId?: number;

  @ApiProperty({
    description: 'vacationType',
    example: VacationDetailType.PENDIENTES,
  })
  @IsNotEmpty()
  @IsEnum(VacationDetailType)
  vacationType?: string;

  @ApiProperty({
    description: 'quantity',
    example: '15',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'reason text',
    example: 'reason text',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({
    description: 'startDate',
    example: '2021-01-15',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    description: 'endDate',
    example: '2021-01-30',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  endDate?: string;
}
