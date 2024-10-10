import { PartialType } from '@nestjs/swagger';
import { CreateBillingDto } from './create-billing.dto';
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Months } from '../../common/enums';
import { BillingState } from '../enum';
const moment = require('moment-timezone');

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  @IsOptional()
  @IsDateString({}, { message: 'Invalid deposit date format' })
  @Transform(
    ({ value }) => {
      const date = moment(value);
      return Months[date.format('MMMM').toUpperCase() as keyof typeof Months];
    },
    { toClassOnly: true },
  )
  depositMonth?: Months;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid deposit date format' })
  depositDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  depositAmountDollars?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  depositAmountSoles?: number;

  @IsOptional()
  @IsEnum(BillingState, { message: 'Invalid state' })
  state2?: BillingState;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid deposit date 2 format' })
  @Transform(
    ({ value }) => {
      const date = moment(value);
      return Months[date.format('MMMM').toUpperCase() as keyof typeof Months];
    },
    { toClassOnly: true },
  )
  depositMonth1?: Months;

  @IsOptional()
  @IsDateString({}, { message: 'Invalid deposit date 2 format' })
  depositDate2?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  depositAmountDollars2?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  depositAmountSoles2?: number;
}
