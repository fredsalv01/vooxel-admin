import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
} from 'class-validator';
import { BankAccountTypes, BankNames } from '../utils/enum-types';

export class CreateBankAccountDto {
  @IsEnum(BankNames)
  @IsNotEmpty()
  bankName: BankNames;

  @IsInt()
  @IsPositive()
  @Max(20)
  cci: number;

  @IsInt()
  @IsPositive()
  @Max(13)
  bankAccountNumber: number;

  @IsNumber()
  @IsOptional()
  workerId: number;

  @IsEnum(BankAccountTypes, {
    message: `Tipos de cuenta de banco validas: ${BankAccountTypes}` 
  })
  @IsNotEmpty()
  bankAccountType: BankAccountTypes;
}
