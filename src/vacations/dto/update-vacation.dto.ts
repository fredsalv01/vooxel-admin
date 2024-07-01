import { PartialType } from '@nestjs/swagger';
import { CreateVacationDto } from './create-vacation.dto';
import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateVacationDto extends PartialType(CreateVacationDto) {
  @IsInt()
  @IsNotEmpty()
  contractWorkerId?: number;

  @IsInt()
  @IsOptional()
  accumulatedVacations?: number;

  @IsInt()
  @IsOptional()
  takenVacations?: number;

  @IsInt()
  @IsOptional()
  remainingVacations?: number;

  @IsInt()
  @IsOptional()
  expiredDays?: number;
}
