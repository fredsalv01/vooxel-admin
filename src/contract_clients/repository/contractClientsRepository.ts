import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractClient } from '../entities/contract_client.entity';
import { DataSource, Repository } from 'typeorm';

export class ContractClientsRepository {
  private readonly logger = new Logger(ContractClientsRepository.name);
  constructor(
    @InjectRepository(ContractClient)
    private readonly db: Repository<ContractClient>,
    private readonly dataSource: DataSource,
  ) {}

  private getContractsBaseQuery() {
    return this.db
      .createQueryBuilder('contract')
      .orderBy('contract.id', 'DESC');
  }

  async createContract(data: any) {
    try {
      // validate if client has an active contract if not create a new one if it has one update the last one to inactive
      const clientContracts = await this.getContractsBaseQuery()
        .where('contract.clientId = :clientId', { clientId: data.clientId })
        .andWhere('contract.isActive = :isActive', { isActive: true })
        .getMany();

      if (clientContracts.length > 0) {
        await this.db.update(
          { id: clientContracts[0].id },
          { isActive: false },
        );
      }

      const result = await this.db.save(new ContractClient(data));
      this.logger.debug(
        `${this.createContract.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CONTRATO DE CLIENTE:', error);
      throw new Error(error);
    }
  }

  async getLatestContractByClientId(clientId: number) {
    const result = await this.db
      .createQueryBuilder('contract')
      .orderBy('contract.id', 'DESC')
      .where('contract.clientId = :clientId', { clientId })
      .andWhere('contract.isActive = :isActive', { isActive: true })
      .select([
        'contract.id',
        'contract.hiringDate',
        'contract.endDate',
        'contract.clientId',
        'contract.isActive',
      ])
      .getOne();
    const file = await this.dataSource.getRepository('File').findOne({
      where: {
        table_name: 'contractClients',
        tag: 'contract',
        tableId: result.id,
      },
    });
    result['file'] = file || 'No se ha subido contrato';

    this.logger.debug(
      `${this.getLatestContractByClientId.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async getContractsByClientId(clientId: number) {
    const result = await this.db
      .createQueryBuilder('contract')
      .orderBy('contract.id', 'DESC')
      .where('contract.clientId = :clientId', { clientId })
      .select([
        'contract.id',
        'contract.hiringDate',
        'contract.endDate',
        'contract.clientId',
        'contract.isActive',
      ])
      .getMany();

    this.logger.debug(
      `${this.getContractsByClientId.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async getAllContracts(clientId: number) {
    const result = await this.db.find({
      where: {
        clientId,
      },
    });

    //obtener el file del contrato por id de contrato
    for (const contract of result) {
      const file = await this.dataSource.getRepository('File').findOne({
        where: {
          table_name: 'contractClients',
          tag: 'contract',
          tableId: contract.id,
        },
      });

      contract['file'] = file || 'No se ha subido contrato';
    }

    return result;
  }

  async getContractById(contractId: number) {
    const result = await this.db.findOne({
      where: {
        id: contractId,
      },
    });

    // validation
    if (!result) {
      throw new Error('Contrato no encontrado');
    }

    const file = await this.dataSource.getRepository('File').findOne({
      where: {
        table_name: 'contractClients',
        tag: 'contract',
        tableId: result.id,
      },
    });

    result['file'] = file || 'No se ha subido contrato';

    return result;
  }

  async updateContract(contractId: number, data: any) {
    const contract = await this.db.findOne({
      where: {
        id: contractId,
      },
    });

    // validation
    if (!contract) {
      throw new Error('Contrato no encontrado');
    }

    const result = await this.db.save({
      ...contract,
      ...data,
    });

    return result;
  }

  async deleteContract(contractId: number) {
    const contract = await this.db.findOne({
      where: {
        id: contractId,
      },
    });

    // validation
    if (!contract) {
      throw new Error('Contrato no encontrado');
    }

    const result = await this.db.softDelete({
      id: contractId,
    });

    return result;
  }
}
