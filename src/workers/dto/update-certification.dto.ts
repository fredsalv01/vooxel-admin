// create import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { IsOptional, IsString } from 'class-validator';

export class UpdateCertificationDto {
  @IsString()
  @IsOptional()
  certificationName?: string;
}
