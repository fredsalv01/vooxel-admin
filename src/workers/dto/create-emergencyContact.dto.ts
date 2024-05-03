import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class EmergencyContactDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsPhoneNumber('PE')
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  relation: string;

  @IsNumber()
  @IsNotEmpty()
  workerId: number;
}
