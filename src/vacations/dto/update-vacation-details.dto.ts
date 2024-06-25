import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacationDetailItem } from '../classes/VacationDetailItem';

export class UpdateVacationDetailsDto {
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  @ApiProperty()
  items?: VacationDetailItem[];
}
