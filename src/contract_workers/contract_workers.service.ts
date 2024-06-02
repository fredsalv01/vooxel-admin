import { Injectable, Logger } from '@nestjs/common';
import { CreateContractWorkerDto } from './dto/create-contract_worker.dto';
import { UpdateContractWorkerDto } from './dto/update-contract_worker.dto';
import { ContractWorkersRepository } from './repositories/contractWorkersRepository';

@Injectable()
export class ContractWorkersService {
  private readonly logger = new Logger(ContractWorkersService.name);
  constructor(
    private readonly contractWorkerRepository: ContractWorkersRepository,
  ) {}

  async create(createContractWorkerDto: CreateContractWorkerDto) {
    this.logger.debug(this.create.name);
    const hasContract = await this.findOne(createContractWorkerDto.workerId);

    if(hasContract){
      this.update(hasContract.id, {isActive: false});
    }

    return this.contractWorkerRepository.createContract(
      createContractWorkerDto,
    );
  }

  findAll(workerId: number) {
    return this.contractWorkerRepository.getAllContracts(workerId);
  }

  findOne(workerId: number) {
    this.logger.debug(this.findOne.name);
    return this.contractWorkerRepository.getLatestContractByWorkerId(workerId);
  }

  update(id: number, updateContractWorkerDto: UpdateContractWorkerDto) {
    this.logger.debug(this.update.name);
    return this.contractWorkerRepository.updateContract(
      id,
      updateContractWorkerDto,
    );
  }
}
