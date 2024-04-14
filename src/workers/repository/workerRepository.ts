import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from '../entities/worker.entity';
import { Repository } from 'typeorm';

export class WorkerRepository {
  constructor(
    @InjectRepository(Worker)
    private readonly db: Repository<Worker>,
  ) {}

  async addWorker(data: any) {
    try {
      return await this.db.save(new Worker(data));
    } catch (error) {
      console.log('ERROR GUARDANDO COLABORADOR:', error);
      throw new Error(error);
    }
  }
}
