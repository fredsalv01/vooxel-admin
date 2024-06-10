import { Injectable } from '@nestjs/common';
import { CreateContractClientDto } from './dto/create-contract_client.dto';
import { UpdateContractClientDto } from './dto/update-contract_client.dto';
import { ContractClientsRepository } from './repository/contractClientsRepository';

@Injectable()
export class ContractClientsService {
  constructor(
    private readonly contractClientsRepository: ContractClientsRepository,
  ) {}

  create(createContractClientDto: CreateContractClientDto) {
    return this.contractClientsRepository.createContract(
      createContractClientDto,
    );
  }

  findAll(clientId: number) {
    return this.contractClientsRepository.getAllContracts(clientId);
  }

  findOne(id: number) {
    return this.contractClientsRepository.getLatestContractByClientId(id);
  }

  update(id: number, updateContractClientDto: UpdateContractClientDto) {
    return this.contractClientsRepository.updateContract(
      id,
      updateContractClientDto,
    );
  }

  remove(id: number) {
    return this.contractClientsRepository.deleteContract(id);
  }
}
