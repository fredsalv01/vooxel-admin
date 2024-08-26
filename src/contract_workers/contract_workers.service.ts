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
    try {
      //validar si tiene contrato anterior
      const previousContract = await this.findOne(
        createContractWorkerDto.workerId,
      );

      if (previousContract) {
        // si tiene desactivarlo para crear uno nuevo
        await this.update(previousContract.id, { isActive: false });
      }
    } catch (error) {
      this.logger.error('ERROR BUSCANDO CONTRATO:', error);
    } finally {
      return this.contractWorkerRepository.createContract(
        createContractWorkerDto,
      );
    }
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
