import { IsOptional, IsString } from 'class-validator';

export class filterBillingServiceDto {
  @IsString()
  @IsOptional()
  input?: string;
}
