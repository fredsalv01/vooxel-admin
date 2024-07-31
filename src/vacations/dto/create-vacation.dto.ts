import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateVacationDto {
  // use the same properties as the entity except for plannedVacations
  // accumulatedVacations
  // takenVacations
  // remainingVacations

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  workerId: number;

  @IsInt()
  @Min(0)
  @Max(30)
  @IsOptional()
  plannedVacations?: number = 0;

  @IsInt()
  @Min(0)
  @IsOptional()
  accumulatedVacations?: number = 0;

  @IsInt()
  @Min(0)
  @IsOptional()
  takenVacations?: number = 0;

  @IsInt()
  @Min(0)
  @IsOptional()
  remainingVacations?: number = 0;
}
