import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Max,
} from 'class-validator';
import { CreateBankAccountDto } from './create-bank-account.dto';
import { BankAccountTypes, BankNames } from '../utils/enum-types';

export class UpdateBankAccountDto extends CreateBankAccountDto {
  @IsEnum(BankNames, {
    message: `Tipos de bancos válidos: ${BankNames}`,
  })
  @IsOptional()
  bankName: BankNames;

  @IsOptional()
  cci: string;

  @IsOptional()
  bankAccountNumber: string;

  @IsEnum(BankAccountTypes, {
    message: `Tipos de cuenta de banco válidas: ${BankAccountTypes}`,
  })
  @IsOptional()
  bankAccountType: BankAccountTypes;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
