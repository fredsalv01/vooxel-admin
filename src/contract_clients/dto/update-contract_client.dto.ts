import { PartialType } from '@nestjs/swagger';
import { CreateContractClientDto } from './create-contract_client.dto';

export class UpdateContractClientDto extends PartialType(CreateContractClientDto) {}
