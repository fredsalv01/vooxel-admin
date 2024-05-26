import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Validate,
} from 'class-validator';
import { dateFormatValidator } from '../../common/functions';
import { ContractType } from '../enum/enum-contract-types';

export class CreateContractWorkerDto {
  @ApiProperty({
    description: 'hiringDate',
    example: '2024-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  hiringDate: string;

  @ApiProperty({
    description: 'hiringDate',
    example: '2024-06-30',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'Tipo de contrato',
    example: `${ContractType.PAYROLL_CONTRACT}`,
  })
  @IsEnum(ContractType)
  @IsNotEmpty()
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]fecha de inicio de contrato

  @ApiProperty({
    description: 'workerId',
    example: '1',
  })
  @IsInt()
  @IsPositive()
  workerId: number;
}
