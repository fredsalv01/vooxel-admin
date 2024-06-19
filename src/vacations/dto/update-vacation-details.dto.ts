import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacationDetailItem } from '../classes/VacationDetailItem';

export class UpdateVacationDetailsDto {
  @IsArray({
    each: true,
  })
  @IsOptional()
  @ApiProperty()
  items: Array<Partial<VacationDetailItem>>;
}


