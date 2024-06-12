import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { WorkerToClient } from '../entities/worker-to-client.entity';

export class WorkerToClientRepository {
  private readonly logger = new Logger(WorkerToClientRepository.name);
  constructor(
    @InjectRepository(WorkerToClient)
    private readonly db: Repository<WorkerToClient>,
    private readonly dataSource: DataSource,
  ) {}

  private getWorkersBaseQuery(): SelectQueryBuilder<WorkerToClient> {
    return this.db.createQueryBuilder('e').orderBy('e.created_at', 'DESC');
  }

  public async validateNewClientForWorker(data: {
    clientId: number;
    workerId: number;
  }) {
    const exists = await this.db.exists({
      where: {
        clientId: data.clientId,
        workerId: data.workerId,
        isActive: true,
      },
    });
    this.logger.debug(
      `${this.validateNewClientForWorker.name} - result`,
      JSON.stringify(exists, null, 2),
    );
    return exists;
  }

  public async create(data: { workerId: number; clientId: number }) {
    const getOld = await this.db.exists({
      where: {
        clientId: data.clientId,
        workerId: data.workerId,
        isActive: true,
      },
    });

    if (getOld) {
      this.db.update(
        {
          clientId: data.clientId,
          workerId: data.workerId,
          isActive: true,
        },
        {
          isActive: false,
        },
      );
    }

    try {
      //crear nuevo
      const result = await this.db.save({
        clientId: data.clientId,
        workerId: data.workerId,
      });

      this.logger.debug(
        `${this.create.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO en WORKER_TO_CLIENTS:', error);
      throw new Error(error);
    }
  }
}
