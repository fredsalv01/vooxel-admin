import { PartialType } from '@nestjs/swagger';
import { CreateContractWorkerDto } from './create-contract_worker.dto';

export class UpdateContractWorkerDto extends PartialType(CreateContractWorkerDto) {}
