import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive, Validate } from 'class-validator';
import { dateFormatValidator } from '../../common/functions';

export class CreateContractClientDto {
  @ApiProperty({
    description: 'startDate',
    example: '2024-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: 'endDate',
    example: '2026-01-01',
  })
  @Validate(dateFormatValidator)
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: 'clientId',
    example: '1',
  })
  @IsInt()
  @IsPositive()
  clientId: number;
}
