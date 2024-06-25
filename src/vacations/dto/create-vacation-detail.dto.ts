import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator';
import { dateFormatValidator } from '../../common/functions';
import { VacationDetailType } from '../enum/vacationDetailType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacationDetailDto {
  @IsNumber()
  @IsNotEmpty()
  vacationId: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description: 'seniority del trabajador',
    example: VacationDetailType.TOMADAS,
  })
  @IsOptional()
  @IsEnum(VacationDetailType)
  vacationType: VacationDetailType;

  @ApiProperty({
    description: 'reason text',
    example: 'reason text',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'startDate',
    example: '2021-01-15',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  startDate: string;

  @ApiProperty({
    description: 'endDate',
    example: '2021-01-30',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  endDate: string;
}
