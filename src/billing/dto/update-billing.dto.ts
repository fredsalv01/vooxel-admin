import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBillingDto } from './create-billing.dto';
import {
  IsBoolean,
  IsDateString,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Months } from '../../common/enums';
import { BillingCurrencyType, BillingDocumentType, BillingState } from '../enum';
import { dateFormatValidator } from 'src/common/functions';
import { IGV } from 'src/common/constants';
const moment = require('moment-timezone');

export class UpdateBillingDto extends PartialType(CreateBillingDto) {
  
  @ApiProperty({
    description: 'tipo de documento',
    example: BillingDocumentType.BOLETA,
    default: BillingDocumentType.BOLETA,
  })
  @IsEnum(BillingDocumentType)
  @IsOptional()
  documentType: BillingDocumentType;

  @ApiProperty({
    description: '001211935',
    example: 'numero de documento',
  })
  @IsOptional()
  documentNumber: string;

  @ApiProperty({
    description: 'Fecha de inicio de facturacion',
    example: '2021-01-01',
  })
  @IsOptional()
  @Validate(dateFormatValidator)
  startDate: string;

  @ApiProperty({
    description: 'fecha limite de pago',
    example: 20,
  })
  @IsNumber()
  @IsOptional()
  paymentDeadline: number;

  @ApiProperty({
    description: 'tipo de servicio',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  serviceId: number;
  
  @ApiProperty({
    description: 'id del cliente',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  clientId: number;

  @ApiProperty({
    description: 'descripcion del servicio',
    default: null,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'numero de orden de compra',
    default: null,
  })
  @IsOptional()
  @IsString()
  purchaseOrderNumber: string;

  @ApiProperty({
    description: 'tipo de cambio',
    example: BillingCurrencyType.DOLARES,
    default: BillingCurrencyType.SOLES,
  })
  @IsEnum(BillingCurrencyType)
  @IsOptional()
  currency: BillingCurrencyType;

  @ApiProperty({
    description: 'valor del tipo de cambio',
    example: 3.82,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  conversionRate: number;

  @ApiProperty({
    description: 'monto',
    example: 20000.22,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  amount: number;

  @ApiProperty({
    description: 'validar si igv activo o no',
    example: true,
    default: false,
  })
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  hasIGV: boolean;

  @ApiProperty({
    description: 'igv',
    example: IGV,
    default: IGV,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  igv: number;

  @ApiProperty({
    description: 'total de la facturacion',
    example: 3000.0,
    default: 0.0,
  })
  @IsNumber({}, { each: true })
  @IsOptional()
  total: number;

  @ApiProperty({
    description: 'Estado de la facturacion',
    example: BillingState.CANCELADO,
    default: BillingState.PENDIENTE,
  })
  @IsEnum(BillingState)
  @IsOptional()
  billingState: BillingState;

  @ApiProperty({
    description: 'fecha de expiracion de la facturacion',
    example: '2021-01-01',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  expirationDate: string;

  @ApiProperty({
    description: 'Dias acumulados despues de la expiracion',
    example: 5,
    default: 0,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  accumulatedDays?: number = 0;

  @ApiProperty({
    description: 'validar si tiene hes o no',
    example: true,
    default: false,
  })
  @IsBoolean()
  @Transform(({ obj, key }) => {
    return obj[key] === 'true' ? true : obj[key] === 'false' ? false : obj[key];
  })
  @IsOptional()
  hasHes: boolean;

  @ApiProperty({
    description: 'numero de hes es un numero unico',
    example: 'c598c49f-c2c7-4ad2-8e29-4a5e4218008a',
  })
  @IsString()
  @IsOptional()
  hes: string;

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
  depositMonth2?: Months;

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
