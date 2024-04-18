import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment-timezone';

export class WorkerRepository {
  constructor(
    @InjectRepository(Worker)
    private readonly db: Repository<Worker>,
  ) {}

  private getWorkersBaseQuery(): SelectQueryBuilder<Worker> {
    return this.db.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  async getWorkersWithHiringTime() {
    const data = await this.db
      .createQueryBuilder()
      .select('e')
      .addSelect(
        'EXTRACT(EPOCH FROM NOW() - e.hiringDate) / 86400',
        'hiringTime',
      )
      .from(Worker, 'e')
      .groupBy('e.id')
      .getRawMany();

    const modifiedWorkers = data.map((worker) => {
      const modifiedWorker = {};
      for (const key in worker) {
        if (Object.prototype.hasOwnProperty.call(worker, key)) {
          // Eliminar el prefijo "e_" de las claves
          const modifiedKey = key.replace('e_', '');
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
}
