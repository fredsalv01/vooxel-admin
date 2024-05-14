import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateClientDto } from '../dto/create-client.dto';
import { Console } from 'console';
import { paginate } from 'nestjs-typeorm-paginate';

export class ClientRepository {
  private readonly logger = new Logger(ClientRepository.name);
  constructor(
    @InjectRepository(Client)
    private readonly db: Repository<Client>,
    private readonly dataSource: DataSource,
  ) {}

  private getClientsBaseQuery(): SelectQueryBuilder<Client> {
    return this.db
      .createQueryBuilder('client')
      .orderBy('client.created_at', 'DESC')
      .leftJoin(
        'client.workerToClients',
        'workerToClient',
        'workerToClient.isActive = :isActive',
        { isActive: true },
      )
      .select([
        'client.id',
        'client.fullName', // Assuming 'fullName' is the combined name fields
        'client.businessName',
        'client.ruc',
        'client.isActive',
        'client.phone',
        'client.email',
        'client.contractStartDate',
        'client.contractEndDate',
        'COUNT(workerToClient.workerToClientId) AS workerToClientCount',
        // Add more fields as needed
      ])
      .groupBy('client.id');
  }

  async addClient(data: any) {
    try {
      const result = await this.db.save(new Client(data));
      this.logger.debug(
        `${this.addClient.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CLIENTE:', error);
      throw new Error(error);
    }
  }

  async findAll({ limit, currentPage, filters }) {
    console.log('VALIDATE FILTERS', filters);

    const qb = this.getClientsBaseQuery();

    if (filters.input && filters.input !== '') {
      const fieldsToSearch = [
        'CAST(client.ruc AS TEXT)',
        'CAST(client.businessName AS TEXT)',
        'CAST(client.fullName AS TEXT)', // Assuming 'fullName' is the combined name fields
        'CAST(client.email AS TEXT)',
        'CAST(client.ruc AS TEXT)',
        'CAST(client.phone AS TEXT)',
        // Add more fields as needed
      ];

      qb.andWhere(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
        input: `%${filters.input}%`,
      });
    }

    // qb.andWhere('workerToClient.isActive = :isActive', { isActive: true });
    qb.andWhere('client.isActive = :isActive', { isActive: filters.isActive });

    const result = await paginate(qb, {
      limit: limit ?? 10,
      page: currentPage ?? 1,
    });

    this.logger.debug(
      `${this.addClient.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }
}
