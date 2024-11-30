import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { WorkerToClient } from '../entities/worker-to-client.entity';
import { Client } from '../../clients/entities/client.entity';
import { ContractWorker } from '../../contract_workers/entities/contract_worker.entity';

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

      if (!data) {
        throw new NotFoundException({
          message: 'Trabajador no encontrado',
        });
      }

      // data.chiefOfficer = data?.chiefOfficer
      //   ? new Worker({
      //       id: data.chiefOfficer.id,
      //       name: `${data.chiefOfficer?.name} ${data.chiefOfficer?.apPat}`,
      //     })
      //   : null;

      // get count per file type for worker using the tag field
      const files = await this.dataSource.getRepository('File').find({
        where: {
          table_name: 'worker',
          tableId: id,
        },
      });

      const filesCount = files.reduce((acc, file) => {
        acc[file.tag] = acc[file.tag] ? acc[file.tag] + 1 : 1;
        return acc;
      }, {});

      data['filesCount'] = filesCount;

      const result = data;
      this.logger.debug(
        `${this.getOneWorker.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR AL OBTENER COLABORADOR: ', error);
      throw new Error(error.detail);
    }
  }

  async findWorkers({ limit, currentPage, filters }): Promise<any> {
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
        'e.contractWorkers',
        ContractWorker,
        'contract',
        'e.id = contract.workerId AND contract.isActive = :isActive',
      )
      .select([
        'e.id',
        'e.documentType',
        'e.documentNumber',
        'e.name',
        'e.apPat',
        'e.apMat',
        'e.birthdate',
        'e.startDate',
        'e.phoneNumber',
        'e.email',
        'e.englishLevel',
        'e.district',
        'e.province',
        'e.department',
        'e.address',
        'e.seniority',
        'e.familiarAssignment',
        'e.salary',
        'contract.contractType',
        'contract.hiringDate',
        'contract.endDate',
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
    const { input, isActive, salary: salaries, paginate: paginated, ...restFilters } = filters;

    if (Object.keys(restFilters).length > 0) {
      for (const [key, value] of Object.entries(restFilters)) {
        if (value) {
          let property = key;
          switch (property) {
            case 'chiefOfficer':
              property = 'chiefOfficer.id';
              break;
            case 'client':
              property = 'client.businessName';
              break;
            default:
              property = `e.${key}`;
              break;
          }
          qb.andWhere(`${property} IN (:...${key})`, {
            [key]: typeof value === 'string' ? [value] : value,
          });
        }
      }
    }

    if(salaries) {
      salaries.forEach((salary: {min?: number, max?:number}) => {
        if(salary.min && salary.max) {
          qb.andWhere(`e.salary >= :min AND e.salary <= :max`, {
            min: salary.min,
            max: salary.max
          });
        } else if(salary.min) {
          qb.andWhere(`e.salary >= :min`, {
            min: salary.min
          });
        } else if(salary.max) {
          qb.andWhere(`e.salary <= :max`, {
            max: salary.max
          });
        }
      });
    }

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

    if (paginated) {
      const result = await paginate(qb, {
        limit: limit ?? 10,
        page: currentPage ?? 1,
      });

      this.logger.debug(
        `${this.findWorkers.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } else {
      const result = await qb.getMany();
      this.logger.debug(
        `${this.findWorkers.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    }
  }

  async updateWorker(id: number, updateWorkerData: any) {
    const worker: Worker = await this.db.preload({
      id: id,
      chiefOfficer: updateWorkerData.chiefOfficerId,
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

  async getVacationWithWorkerId(workerId: number): Promise<Worker> {
    const worker = await this.db.findOne({
      where: {
        id: workerId,
        isActive: true,
      },
      relations: ['vacation', 'vacation.vacationDetails'],
    });

    if (!worker) {
      throw new NotFoundException(
        `No se encontro el trabajador con el id ${workerId}`,
      );
    }

    return worker;
  }

  async getUniqueValues() {
    const qbdocumentType = this.db
      .createQueryBuilder('worker')
      .select('worker.documentType')
      .where('worker.documentType IS NOT NULL')
      .distinct(true);

    const qbcharge = this.db
      .createQueryBuilder('worker')
      .select('worker.charge')
      .where('worker.charge IS NOT NULL')
      .distinct(true);

    const qbenglishLevel = this.db
      .createQueryBuilder('worker')
      .select('worker.englishLevel')
      .where('worker.englishLevel IS NOT NULL')
      .distinct(true);

    const qbSeniority = this.db
      .createQueryBuilder('worker')
      .select('worker.seniority')
      .where('worker.seniority IS NOT NULL')
      .distinct(true);

    const qbDistrict = this.db
      .createQueryBuilder('worker')
      .select('worker.district')
      .where('worker.district IS NOT NULL')
      .distinct(true);

    const qbProvince = this.db
      .createQueryBuilder('worker')
      .select('worker.province')
      .where('worker.province IS NOT NULL')
      .distinct(true);

    const qbDepartment = this.db
      .createQueryBuilder('worker')
      .select('worker.department')
      .where('worker.department IS NOT NULL')
      .distinct(true);

    const qbclient = this.db
      .createQueryBuilder('worker')
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
      .select('client.businessName')
      .where('client.businessName IS NOT NULL')
      .distinct(true);

    const [
      documentType,
      charge,
      englishLevel,
      seniority,
      district,
      province,
      department,
      client,
    ] = await Promise.all([
      qbdocumentType.getRawMany(),
      qbcharge.getRawMany(),
      qbenglishLevel.getRawMany(),
      qbSeniority.getRawMany(),
      qbDistrict.getRawMany(),
      qbProvince.getRawMany(),
      qbDepartment.getRawMany(),
      qbclient.getRawMany(),
    ]);
    console.log('client', client);
    return {
      documentType: documentType.map((item) => item.worker_documentType),
      charge: charge.map((item) => item.worker_charge),
      englishLevel: englishLevel.map((item) => item.worker_englishLevel),
      seniority: seniority.map((item) => item.worker_seniority),
      district: district.map((item) => item.worker_district),
      province: province.map((item) => item.worker_province),
      department: department.map((item) => item.worker_department),
      client: client.map((item) => item.client_businessName),
    };
  }
}
