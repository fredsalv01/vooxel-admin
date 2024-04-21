import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { paginate } from '../../pagination/interfaces/paginator.interface';

export class WorkerRepository {
  constructor(
    @InjectRepository(Worker)
    private readonly db: Repository<Worker>,
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

  async findWorkers({ limit, currentPage }) {
    return await paginate(
      this.getWorkersBaseQuery()
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
          'emergencyContacts',
          'chiefOfficer.name',
        ]),
      {
        limit,
        currentPage,
        total: true,
      },
    );
  }
}
