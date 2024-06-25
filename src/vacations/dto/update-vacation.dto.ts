import { PartialType } from '@nestjs/swagger';
import { CreateVacationDto } from './create-vacation.dto';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateVacationDto extends PartialType(CreateVacationDto) {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  contractWorkerId?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  accumulatedVacations?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  takenVacations?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  remainingVacations?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  expiredDays?: number;
}
