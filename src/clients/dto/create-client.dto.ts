import { IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsOptional()
  phone: string;
}
