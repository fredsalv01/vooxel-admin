import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { Certification } from '../entities/certification.entity';
import { BankAccount } from '../entities/bank-account.entity';

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
        'worker.contractType',
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
        .leftJoinAndSelect('worker.client', 'client')
        .leftJoinAndSelect('worker.bankAccount', 'bankAccount')
        // .addSelect('chiefOfficer.apPat', 'chiefOfficerApPat')
        .where('worker.id = :id', { id: id })
        .getOne();

      data.chiefOfficer = data.chiefOfficer
        ? new Worker({
            name: `${data.chiefOfficer?.name} ${data.chiefOfficer?.apPat}`,
          })
        : null;

      return data;
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
      .leftJoin('e.workerToClient', 'workerToClient')
      .select([
        'e.id',
        'e.documentType',
        'e.documentNumber',
        'e.name',
        'e.apPat',
        'e.apMat',
        'e.contractType',
        'e.charge',
        'e.techSkills',
        'e.isActive',
        'emergencyContacts.id',
        'emergencyContacts.phone',
        'emergencyContacts.name',
        'emergencyContacts.relation',
        'chiefOfficer.id',
        'chiefOfficer.name',
        'workerToClient.id',
        'workerToClient.client',
      ]);

    const { input, isActive } = filters;

    if (input) {
      const fieldsToSearch = [
        'CAST(e.documentType AS TEXT)',
        'CAST(e.documentNumber AS TEXT)',
        'CAST(e.name AS TEXT)',
        'CAST(e.apPat AS TEXT)',
        'CAST(e.apMat AS TEXT)',
        'CAST(e.contractType AS TEXT)',
        'CAST(e.charge AS TEXT)',
        'CAST(e.techSkills AS TEXT)',
        'CAST(chiefOfficer.name AS TEXT)',
        'CAST(client.businessName AS TEXT)',
      ];

      qb.andWhere(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
        input: `%${input}%`,
      });
    }

    qb.andWhere('workerToClient.isActive = :isActive', { isActive: true });
    
    qb.andWhere('e.isActive = :isActive', {
      isActive,
    });

    return await paginate(qb, {
      limit: limit ?? 10,
      page: currentPage ?? 1,
    });
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
      // Insert EmergencyContacts
      if (
        updateWorkerData.emergencyContacts &&
        updateWorkerData.emergencyContacts.length > 0
      ) {
        for (const emergencyContactData of updateWorkerData.emergencyContacts) {
          const emergencyContact = queryRunner.manager.create(
            EmergencyContact,
            emergencyContactData,
          );
          await queryRunner.manager.save(emergencyContact);
        }
      }

      // Insert Certifications
      if (
        updateWorkerData.certifications &&
        updateWorkerData.certifications.length > 0
      ) {
        for (const certificationData of updateWorkerData.certifications) {
          const certification = queryRunner.manager.create(
            Certification,
            certificationData,
          );
          await queryRunner.manager.save(certification);
        }
      }

      if (updateWorkerData.bankAccount) {
        const bankAccount = queryRunner.manager.create(
          BankAccount,
          updateWorkerData.bankAccount,
        );
        await queryRunner.manager.save(bankAccount);
      }

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
