import { getRandomInt } from './../../common/functions';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Length,
} from 'class-validator';
import { BankAccountTypes, BankNames } from '../utils/enum-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBankAccountDto {
  @ApiProperty({
    description: 'Nombre del banco de la cuenta',
    example: `SCOTIABANK`,
  })
  @IsEnum(BankNames)
  @IsNotEmpty()
  bankName: BankNames;

  @ApiProperty({
    description: 'Codigo de cuenta interbancario',
    example: `${getRandomInt(111111111111111111111, 999999999999999999999)}`,
  })
  @IsNotEmpty()
  cci: string;

  @ApiProperty({
    description: 'Codigo de cuenta',
    example: `${getRandomInt(1111111111111, 9999999999999)}`,
  })
  @IsNotEmpty()
  bankAccountNumber: string;

  @IsNumber()
  @IsOptional()
  workerId: number;

  @ApiProperty({
    description: 'Tipo de cuenta bancaria',
    example: `${BankAccountTypes.SUELDO}`,
  })
  @IsEnum(BankAccountTypes, {
    message: `Tipos de cuenta de banco validas: ${BankAccountTypes}`,
  })
  @IsNotEmpty()
  bankAccountType: BankAccountTypes;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
