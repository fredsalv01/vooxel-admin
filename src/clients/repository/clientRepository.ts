import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../entities/client.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
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
        'client.businessName',
        'client.ruc',
        'client.isActive',
        'client.phone',
        'client.address',
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

    const qb = this.getClientsBaseQuery()
      // get latest contract clients
      .leftJoinAndSelect('client.contractClients', 'contractClient')
      .where('contractClient.isActive = :isActive', { isActive: true })
      .orderBy('contractClient.startDate', 'DESC')
      .addGroupBy('contractClient.id');

    if (filters.input && filters.input !== '') {
      const fieldsToSearch = [
        'CAST(client.ruc AS TEXT)',
        'CAST(client.businessName AS TEXT)',
        'CAST(client.ruc AS TEXT)',
        'CAST(client.phone AS TEXT)',
        'CAST(client.address AS TEXT)'
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
      `${this.findAll.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async findOne(id: number) {
    try {
      const result = this.getClientsBaseQuery()
        .where('client.id = :id', { id })
        .getOne();
      if (!result) {
        throw new NotFoundException(
          `No se encontro el cliente con el id ${id}`,
        );
      }
      this.logger.debug(
        `${this.findOne.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR BUSCANDO AL CLIENTE:', error);
      throw new Error(error);
    }
  }

  async updateOne(id: number, data: any) {
    const client = await this.db.preload({
      id: id,
      ...data,
    });

    if (!client) {
      throw new NotFoundException({
        error: 'Cliente no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(client);
      await queryRunner.commitTransaction();
      this.logger.debug(
        `${this.updateOne.name} - result`,
        JSON.stringify(client, null, 2),
      );
      return client;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      this.logger.error(
        `${this.updateOne.name} - error`,
        JSON.stringify(error, null, 2),
      );
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteOne(id: number) {
    try {
      await this.findOne(id);

      const result = this.db.update(
        {
          id,
        },
        {
          isActive: false,
        },
      );
      this.logger.debug(
        `${this.deleteOne.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error('ERROR DESACTIVAR AL CLIENTE:', error);
      throw new Error(error);
    }
  }
}
