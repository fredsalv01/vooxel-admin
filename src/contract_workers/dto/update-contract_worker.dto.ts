import { PartialType } from '@nestjs/swagger';
import { CreateContractWorkerDto } from './create-contract_worker.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateContractWorkerDto extends PartialType(
  CreateContractWorkerDto,
) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
