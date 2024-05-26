import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { BankAccountTypes, BankNames } from '../utils/enum-types';

export class UpdateBankAccountDto {
  @IsEnum(BankNames, {
    message: `Tipos de bancos válidos: ${BankNames}`,
  })
  @IsOptional()
  bankName?: BankNames;

  @IsOptional()
  cci?: string;

  @IsOptional()
  bankAccountNumber?: string;

  @IsEnum(BankAccountTypes, {
    message: `Tipos de cuenta de banco válidas: ${BankAccountTypes}`,
  })
  @IsOptional()
  bankAccountType?: BankAccountTypes;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isMain?: boolean;
}
