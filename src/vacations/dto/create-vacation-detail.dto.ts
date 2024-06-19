import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { dateFormatValidator } from '../../common/functions';
import { VacationDetailType } from '../enum/vacationDetailType';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVacationsDetailsDto {
  @IsNumber()
  @IsNotEmpty()
  vacationId: number;

  @ApiProperty({
    description: 'seniority del trabajador',
    example: VacationDetailType.TOMADAS,
  })
  @IsNotEmpty()
  @IsEnum(VacationDetailType)
  vacationType: VacationDetailType;

  @ApiProperty({
    description: 'reason text',
    example: '2021-01-15',
  })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({
    description: 'startDate',
    example: '2021-01-15',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'endDate',
    example: '2021-01-30',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  endDate: string;
}
