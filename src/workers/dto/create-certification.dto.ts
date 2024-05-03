import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  urlFile: string;

  @IsNumber()
  @IsNotEmpty()
  workerId: number;
}
