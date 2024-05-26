import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { BankAccountTypes, BankNames } from '../utils/enum-types';
import { ApiProperty } from '@nestjs/swagger';
import { getRandomInt } from '../../common/functions';

export class UpdateBankAccountDto {
  @ApiProperty({
    description: 'Nombre del banco de la cuenta',
    example: `${BankNames.BANCO_LA_NACION}`,
  })
  @IsEnum(BankNames, {
    message: `Tipos de bancos válidos: ${BankNames}`,
  })
  @IsOptional()
  bankName?: BankNames;

  @ApiProperty({
    description: 'Codigo de cuenta interbancario',
    example: `${getRandomInt(111111111111111111111, 999999999999999999999)}`,
  })
  @IsOptional()
  cci?: string;

  @ApiProperty({
    description: 'Codigo de cuenta',
    example: `${getRandomInt(1111111111111, 9999999999999)}`,
  })
  @IsOptional()
  bankAccountNumber?: string;

  @ApiProperty({
    description: 'Tipo de cuenta bancaria',
    example: `${BankAccountTypes.AHORROS}`,
  })
  @IsEnum(BankAccountTypes, {
    message: `Tipos de cuenta de banco válidas: ${BankAccountTypes}`,
  })
  @IsOptional()
  AccountType?: BankAccountTypes;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;

  @ApiProperty({
    description: 'Id del worker',
    example: `1`,
  })
  @IsNumber()
  @IsNotEmpty()
  workerId: number;
}
