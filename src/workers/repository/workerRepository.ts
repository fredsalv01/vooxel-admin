import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from '../../pagination/interfaces/paginator.interface';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class WorkerRepository {
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
      .addSelect('chiefOfficer.apPat', 'chiefOfficerApPat')
      .addSelect('COUNT(emergencyContacts.id)', 'emergencyContactsCount')
      .groupBy('worker.id')
      .addGroupBy('chiefOfficer.name')
      .addGroupBy('chiefOfficer.apPat')
      .getRawMany();

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
      return await this.db.save(new Worker(data));
    } catch (error) {
      console.log('ERROR GUARDANDO COLABORADOR:', error);
      throw new Error(error);
    }
  }

  async getOneWorker(id: number) {
    try {
      const data = await this.db
        .createQueryBuilder('worker')
        .leftJoinAndSelect('worker.emergencyContacts', 'emergencyContacts')
        .leftJoinAndSelect('worker.chiefOfficer', 'chiefOfficer')
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
      console.log('ERROR AL OBTENER COLABORADOR: ', error);
      throw new Error(error);
    }
  }

  async findWorkers({ limit, currentPage, filters }) {
    console.log('VALIDATE Filters', filters);
    const qb = this.getWorkersBaseQuery()
      .leftJoin('e.emergencyContacts', 'emergencyContacts')
      .leftJoin('e.chiefOfficer', 'chiefOfficer')
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
        'emergencyContacts.id',
        'emergencyContacts.phone',
        'emergencyContacts.name',
        'emergencyContacts.relation',
        'chiefOfficer.id',
        'chiefOfficer.name',
      ]);

    // Destructurar el objeto filters y obtener la entrada de usuario
    const { input, techSkills } = filters;

    // Inicializar el objeto de condiciones para el bucle de comparación
    const conditions = [];

    // Comprobar si la entrada de usuario está definida
    if (input) {
      // Iterar sobre los campos deseados y crear condiciones LIKE para cada uno
      const fieldsToSearch = [
        'documentType',
        'documentNumber',
        'name',
        'apPat',
        'apMat',
        'contractType',
        'charge',
      ];

      fieldsToSearch.forEach((field) => {
        if (field === 'documentType') {
          conditions.push(`CAST(e.${field} AS TEXT) ILIKE :input`);
        } else if (field === 'contractType') {
          conditions.push(`CAST(e.${field} AS TEXT) ILIKE :input`);
        } else {
          conditions.push(`e.${field} ILIKE :input`);
        }
      });
    }

    // Comprobar si se han generado condiciones para la entrada de usuario
    if (conditions.length > 0) {
      // Unir todas las condiciones con un OR y agregarlas al query builder
      qb.andWhere(`(${conditions.join(' OR ')})`, { input: `%${input}%` });
    }

    if (techSkills.length > 0) {
      qb.andWhere("ARRAY_TO_STRING(e.techSkills, ',') LIKE :techSkills", {
        techSkills: `%${techSkills.join(',')}%`,
      });
    }

    return await paginate(qb, {
      limit,
      currentPage,
      total: true,
    });
  }

  async updateWorker(id: number, updateWorkerData: UpdateWorkerDto) {
    // const worker = await this.db.preload({
    //   id: id,
    //   ...updateWorkerData,
    // });

    // if (!worker) {
    //   throw new NotFoundException({
    //     error: 'Colaborador no encontrado',
    //   });
    // }
    console.log('updateWorkerData', updateWorkerData);
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    // try {
    //   await queryRunner.manager.save(worker);
    //   await queryRunner.commitTransaction();
    //   await queryRunner.release();
    //   return worker;
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   await queryRunner.release();
    //   throw new BadRequestException({
    //     error: error?.detail,
    //   });
    // }
  }
}
