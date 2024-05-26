import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { Certification } from '../entities/certification.entity';
import { BankAccount } from '../entities/bank-account.entity';
import { WorkerToClient } from '../entities/worker-to-client.entity';
import { Client } from '../../clients/entities/client.entity';
import { ContractWorker } from "../../contract_workers/entities/contract_worker.entity";

export class WorkerRepository {
  private readonly logger = new Logger(WorkerRepository.name);
  constructor(
    @InjectRepository(Worker)
    private readonly db: Repository<Worker>,
    private readonly dataSource: DataSource,
  ) {}

  private getWorkersBaseQuery(): SelectQueryBuilder<Worker> {
    return this.db.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  async getWorkersWithHiringTime() {
    // get all emergency contacts and chief officer with hiring time too
    const data = await this.db
      .createQueryBuilder('worker')
      .leftJoin('worker.emergencyContacts', 'emergencyContacts')
      .leftJoin('worker.chiefOfficer', 'chiefOfficer')
      .leftJoin('worker.client', 'client')
      .select([
        'worker.id',
        'worker.documentType',
        'worker.documentNumber',
        'worker.name',
        'worker.apPat',
        'worker.apMat',
        'worker.charge',
        'worker.techSkills',
      ])
      .addSelect(
        'chiefOfficer.name', // Concatenar nombre y apellido paterno del jefe si tiene
        'chiefOfficerName',
      )
      .addSelect('client.businessName', 'clientName')
      .addSelect('chiefOfficer.apPat', 'chiefOfficerApPat')
      .addSelect('COUNT(emergencyContacts.id)', 'emergencyContactsCount')
      .groupBy('worker.id')
      .addGroupBy('chiefOfficer.name')
      .addGroupBy('chiefOfficer.apPat')
      .getRawMany();
    this.logger.debug(
      `${this.getWorkersWithHiringTime} - dbResponse`,
      JSON.stringify(data, null, 2),
    );
    const modifiedWorkers = data.map((worker) => {
      const modifiedWorker = {};
      for (const key in worker) {
        if (Object.prototype.hasOwnProperty.call(worker, key)) {
          // Eliminar el prefijo "e_" de las claves
          const modifiedKey = key.replace('worker_', '');
          modifiedWorker[modifiedKey] = worker[key];
        }
      }
      return modifiedWorker;
    });

    return modifiedWorkers;
  }

  async addWorker(data: any) {
    try {
      const result = await this.db.save(new Worker(data));
      this.logger.debug(
        `${this.addWorker.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO COLABORADOR:', error);
      throw new Error(error);
    }
  }

  async getOneWorker(id: number) {
    try {
      const data = await this.db
        .createQueryBuilder('worker')
        .leftJoinAndSelect('worker.emergencyContacts', 'emergencyContacts')
        .leftJoinAndSelect('worker.chiefOfficer', 'chiefOfficer')
        .leftJoinAndSelect('worker.certifications', 'certifications')
        .leftJoinAndMapOne(
          'worker.clientInfo',
          WorkerToClient,
          'workerToClient',
          'worker.id = workerToClient.workerId AND workerToClient.isActive = :isActive',
          { isActive: true },
        )
        .leftJoinAndMapOne(
          'worker.clientInfo.client',
          Client,
          'client',
          'workerToClient.clientId = client.id',
        )
        .leftJoinAndSelect('worker.bankAccounts', 'bankAccounts')
        .leftJoinAndSelect('worker.contractWorkers', 'contracts')
        .where('worker.id = :id', { id: id })
        .getOne();

      data.chiefOfficer = data.chiefOfficer
        ? new Worker({
            name: `${data.chiefOfficer?.name} ${data.chiefOfficer?.apPat}`,
          })
        : null;

      const result = data;
      this.logger.debug(
        `${this.getOneWorker.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR AL OBTENER COLABORADOR: ', error);
      throw new Error(error);
    }
  }

  async findWorkers({ limit, currentPage, filters }) {
    console.log('VALIDATE Filters', filters);
    const qb = this.getWorkersBaseQuery()
      .leftJoin('e.emergencyContacts', 'emergencyContacts')
      .leftJoin('e.chiefOfficer', 'chiefOfficer')
      .leftJoinAndMapOne(
        'e.clientInfo',
        WorkerToClient,
        'workerToClient',
        'e.id = workerToClient.workerId AND workerToClient.isActive = :isActive',
        { isActive: true },
      )
      .leftJoinAndMapOne(
        'e.clientInfo.client',
        Client,
        'client',
        'workerToClient.clientId = client.id',
      )
      .leftJoinAndMapOne(
        'e.contracWorkers',
        ContractWorker,
        'contract',
        'e.id = contract.workerId AND contract.isActive = :isActive'
      )
      .select([
        'e.id',
        'e.documentType',
        'e.documentNumber',
        'e.name',
        'e.apPat',
        'e.apMat',
        'contract.contractType',
        'e.charge',
        'e.techSkills',
        'e.isActive',
        'emergencyContacts.id',
        'emergencyContacts.phone',
        'emergencyContacts.name',
        'emergencyContacts.relation',
        'chiefOfficer.id',
        'chiefOfficer.name',
        'client.id', // Include client id
        'client.businessName',
        'client.ruc',
      ]);
    const { input, isActive } = filters;

    if (input) {
      const fieldsToSearch = [
        'CAST(e.documentType AS TEXT)',
        'CAST(e.documentNumber AS TEXT)',
        'CAST(e.name AS TEXT)',
        'CAST(e.apPat AS TEXT)',
        'CAST(e.apMat AS TEXT)',
        'CAST(contract.contractType AS TEXT)',
        'CAST(e.charge AS TEXT)',
        'CAST(e.techSkills AS TEXT)',
        'CAST(chiefOfficer.name AS TEXT)',
        'CAST(client.businessName AS TEXT)',
      ];

      qb.andWhere(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
        input: `%${input}%`,
      });
    }

    qb.andWhere('e.isActive = :isActive', {
      isActive,
    });

    const result = await paginate(qb, {
      limit: limit ?? 10,
      page: currentPage ?? 1,
    });
    this.logger.debug(
      `${this.findWorkers.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async updateWorker(id: number, updateWorkerData: any) {
    const worker: Worker = await this.db.preload({
      id: id,
      ...updateWorkerData,
    });

    if (!worker) {
      throw new NotFoundException({
        error: 'Colaborador no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(worker);

      await queryRunner.commitTransaction();
      return worker;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }
}
