import { InjectRepository } from '@nestjs/typeorm';
import { ContractWorker } from '../entities/contract_worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';

export class ContractWorkersRepository {
  private readonly logger = new Logger(ContractWorkersRepository.name);

  constructor(
    @InjectRepository(ContractWorker)
    private readonly db: Repository<ContractWorker>,
    private readonly dataSource: DataSource,
  ) {}

  private getContractsBaseQuery(): SelectQueryBuilder<ContractWorker> {
    return this.db.createQueryBuilder('contract').orderBy('e.id', 'DESC');
  }

  async createContract(data: any) {
    try {
      const result = await this.db.save(new ContractWorker(data));

      this.logger.debug(
        `${this.createContract.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CONTRATO DE TRABAJADOR:', error);
      throw new Error(error);
    }
  }

  async getLatestContractByWorkerId(workerId: number) {
    const result = this.getContractsBaseQuery()
      .where('contract.workerId = :workerId', { workerId })
      .andWhere('contract.isActive = :isActive', { isActive: true })
      .select([
        'contract.id',
        'contract.hiringDate',
        'contract.endDate',
        'contract.workerId',
        'contract.isActive',
      ])
      .getOne();

    this.logger.debug(
      `${this.getLatestContractByWorkerId.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async getAllContracts(workerId: number) {
    const result = await this.db.find({
      where: {
        workerId,
      },
    });

    this.logger.debug(
      `${this.getAllContracts.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async updateContract(id: number, updateContractWorker: any) {
    const contract: ContractWorker = await this.db.preload({
      id: id,
      ...updateContractWorker,
    });

    if (!contract) {
      throw new NotFoundException({
        error: 'Colaborador no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(contract);

      await queryRunner.commitTransaction();
      return contract;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }
}
