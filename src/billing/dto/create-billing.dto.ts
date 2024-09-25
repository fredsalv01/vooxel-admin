import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { BillingDocumentType } from '../enum/DocumentType';
import { dateFormatValidator } from 'src/common/functions';
import { BillingCurrencyType } from '../enum/CurrencyType';
import { Transform } from 'class-transformer';
import { BillingState } from '../enum/BillingState';
import { IGV } from '../../common/constants';

export class CreateBillingDto {

  @ApiProperty({
    description: 'tipo de documento',
    example: BillingDocumentType.BOLETA,
    default: BillingDocumentType.BOLETA,
  })
  @IsEnum(BillingDocumentType)
  @IsNotEmpty()
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
  @IsNotEmpty()
  @Validate(dateFormatValidator)
  startDate: string;

  @ApiProperty({
    description: 'fecha limite de pago',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  paymentDeadline: number;

  @ApiProperty({
    description: 'tipo de servicio',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;
  
  @ApiProperty({
    description: 'id del cliente',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @ApiProperty({
    description: 'descripcion del servicio',
    default: null,
  })
  @IsOptional()
  @IsString()
  descripcion: string;

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
  @IsNotEmpty()
  currency: BillingCurrencyType;

  @ApiProperty({
    description: 'valor del tipo de cambio',
    example: 3.82,
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  currencyValue: number;

  @ApiProperty({
    description: 'monto',
    example: 20000.22,
  })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
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
  @IsNotEmpty()
  billingState: BillingState;

  @ApiProperty({
    description: 'fecha de cambio de estado',
    example: '2021-01-01',
  })
  @Validate(dateFormatValidator)
  @IsOptional()
  billingStateDate: string;

  @ApiProperty({
    description: 'fecha de expiracion de la facturacion',
    example: '2021-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
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
  hashes: boolean;

  @ApiProperty({
    description: 'numero de hes es un numero unico',
    example: 'c598c49f-c2c7-4ad2-8e29-4a5e4218008a',
  })
  @IsString()
  @IsOptional()
  hes: string;
}
