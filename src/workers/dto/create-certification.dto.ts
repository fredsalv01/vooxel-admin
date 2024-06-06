import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @IsNotEmpty()
  certificationName: string;

  @IsNumber()
  @IsNotEmpty()
  workerId: number;
}
