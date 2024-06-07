import { IsInt, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class CreateVacationDto {
  // use the same properties as the entity except for plannedVacations
  // accumulatedVacations
  // takenVacations
  // remainingVacations

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  contractWorkerId: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  plannedVacations?: number;
}
