import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { VacationDetailType } from '../enum/vacationDetailType';

export class VacationDetailItem {
  constructor(partial?: Partial<VacationDetailItem>) {
    Object.assign(this, partial);
  }

  id: number;

  @IsNumber()
  @IsOptional()
  vacationId?: number;

  @IsNotEmpty()
  @IsEnum(VacationDetailType)
  vacationType?: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  reason?: string;

  startDate?: string;

  endDate?: string;
}
