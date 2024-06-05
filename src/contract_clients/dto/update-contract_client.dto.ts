import { PartialType } from '@nestjs/swagger';
import { CreateContractClientDto } from './create-contract_client.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateContractClientDto extends PartialType(
  CreateContractClientDto,
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
