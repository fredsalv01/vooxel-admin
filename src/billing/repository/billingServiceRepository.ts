import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

export class BillingServiceRepository {
  private readonly logger = new Logger(BillingServiceRepository.name);
  constructor(
    @InjectRepository(Service)
    private readonly db: Repository<Service>,
    private readonly dataSource: DataSource,
  ) {}

  async create(data: any) {
    try {
      const result = await this.db.save(new Service(data));
      this.logger.debug(
        `${this.create.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO DATOS DE SERVICIO:', error);
      throw new Error(error);
    }
  }

  async list() {
    try {
      const result = await this.db.find({
        select: {
          name: true,
          id: true,
        },
      });
      this.logger.debug(
        `${this.list.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR LISTANDO DATOS DE SERVICIO:', error);
      throw new Error(error);
    }
  }

  async findOneByName(name: string) {
    try {
      const fieldsToSearch = ['CAST(e.name AS TEXT)'];
      const result = await this.db
        .createQueryBuilder('e')
        .orderBy('id', 'DESC')
        .select(['e.id', 'e.name'])
        .where(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
          input: `%${name}%`,
        })
        .getOne();
      this.logger.debug(
        `${this.findOneByName.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error(
        `${this.findOneByName.name} - ERROR ENCONTRANDO DATOS DE SERVICIO:`,
        error,
      );
      throw new Error(error);
    }
  }

  async findOneById(id: number) {
    try {
      const result = await this.db.findOne({
        where: {
          id,
        },
      });
      this.logger.debug(
        `${this.findOneById.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR ENCONTRANDO DATOS DE SERVICIO:', error);
      throw new Error(error);
    }
  }
}
