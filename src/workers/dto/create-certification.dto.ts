import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @IsNotEmpty()
  certificationName: string;

  @IsString()
  @IsNotEmpty()
  keyFile: string;

  @IsString()
  @IsNotEmpty()
  path: string;

  @IsNumber()
  @IsNotEmpty()
  workerId: number;
}
