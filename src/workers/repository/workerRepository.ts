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
      // if (worker.hiringTime > 0) {
      console.log(worker.hiringTime);
      console.log(Math.round(Number(worker.hiringTime) * 12));
      worker.hiringTime = Math.round(
        Number(worker.hiringTime) * 12,
      ).toString();
      // }

      return modifiedWorker;
    });

    return modifiedWorkers;

    // 1000*3600*24
  }

  async addWorker(data: any) {
    try {
      return await this.db.save(new Worker(data));
    } catch (error) {
      console.log('ERROR GUARDANDO COLABORADOR:', error);
      throw new Error(error);
    }
  }
}
