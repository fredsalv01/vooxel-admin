import { Injectable } from '@nestjs/common';
import { CreateContractClientDto } from './dto/create-contract_client.dto';
import { UpdateContractClientDto } from './dto/update-contract_client.dto';

@Injectable()
export class ContractClientsService {
  create(createContractClientDto: CreateContractClientDto) {
    return 'This action adds a new contractClient';
  }

  findAll() {
    return `This action returns all contractClients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contractClient`;
  }

  update(id: number, updateContractClientDto: UpdateContractClientDto) {
    return `This action updates a #${id} contractClient`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractClient`;
  }
}
