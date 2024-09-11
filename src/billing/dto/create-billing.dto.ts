import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Validate,
} from 'class-validator';
import { BillingDocumentType } from '../enum/DocumentType';
import { dateFormatValidator } from 'src/common/functions';
import { BillingServiceType } from '../enum/ServiceType';
import { BillingCurrencyType } from '../enum/CurrencyType';
import { Transform } from 'class-transformer';
import { BillingState } from '../enum/BillingState';
import { IGV } from '../../common/constants';

export class CreateBillingDto {
  @ApiProperty({
    description: 'Nombre del cliente',
    example: 'Rimac Seguros',
  })
  @IsNotEmpty()
  @IsString()
  clientName: string;

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
    example: '2021-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  paymentDeadline: string;

  @ApiProperty({
    description: 'tipo de servicio',
    example: BillingServiceType.CONSULTORIA,
    default: BillingServiceType.CONSULTORIA,
  })
  @IsEnum(BillingServiceType)
  @IsNotEmpty()
  serviceType: BillingServiceType;

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
  @IsDecimal({
    decimal_digits: '2',
    locale: 'es-ES',
  })
  @IsNotEmpty()
  currencyValue: number;

  @ApiProperty({
    description: 'monto',
    example: 20000.22,
  })
  @IsDecimal({
    decimal_digits: '2',
    locale: 'es-ES',
  })
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
  @IsDecimal({
    decimal_digits: '2',
    locale: 'es-ES',
  })
  @IsOptional()
  igv: number;

  @ApiProperty({
    description: 'total de la facturacion',
    example: 30000,
    default: 0.0,
  })
  @IsDecimal({
    decimal_digits: '2',
    locale: 'es-ES',
  })
  @IsOptional()
  total: number;

  @ApiProperty({
    description: 'Estado de la facturacion',
    example: BillingState.CANCELADO,
    default: BillingState.PENDIENTE,
  })
  @IsEnum(BillingCurrencyType)
  @IsNotEmpty()
  billingState: BillingCurrencyType;

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
    description: 'validar si tiene HES o no',
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
    description: 'numero de HES es un numero unico',
    example: 'c598c49f-c2c7-4ad2-8e29-4a5e4218008a',
  })
  @IsString()
  @IsOptional()
  Hes: string;
}
