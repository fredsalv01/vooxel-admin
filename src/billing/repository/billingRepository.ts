import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from '../entities/billing.entity';
import { DataSource, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { CreateBillingDto } from '../dto/create-billing.dto';
import { Service } from '../entities/service.entity';

export class BillingRepository {
  private readonly logger = new Logger(BillingRepository.name);
  constructor(
    @InjectRepository(Billing)
    private readonly db: Repository<Billing>,
    private readonly dataSource: DataSource,
  ) {}

  private getBillingBaseQuery() {
    return this.db.createQueryBuilder('billing').orderBy('billing.id', 'DESC');
  }

  async createBilling(data: any, service: Service) {
    try {
      const billing = this.db.create({
        ...data,
        service,
      });
      const result = await this.db.save(billing);
      this.logger.debug(
        `${this.createBilling.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO DATOS DE FACTURACION:', error);
      throw new Error(error);
    }
  }

  async getBillingList({ limit, currentPage, filters }) {
    this.logger.log('VALIDATE FILTERS', filters);

    const qb = this.getBillingBaseQuery();
    const { input } = filters;
    qb.leftJoinAndSelect('billing.service', 'service');
    if (input) {
      const fieldsToSearch = [
        'CAST(billing.clientName AS TEXT)',
        'CAST(billing.documentType AS TEXT)',
        'CAST(billing.documentNumber AS TEXT)',
        'CAST(billing.purchaseOrderNumber AS TEXT)',
        'CAST(billing.currency AS TEXT)',
        'CAST(billing.billingState AS TEXT)',
        'CAST(billing.hes AS TEXT)',
        'CAST(service.name AS TEXT)'
      ];
      qb.andWhere(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
        input: `%${input}%`,
      });
    }

    const result = await paginate(qb, {
      limit: limit ?? 10,
      page: currentPage ?? 1,
    });
    this.logger.debug(
      `${this.getBillingList.name} - result`,
      JSON.stringify(result, null, 2),
    );
    return result;
  }

  async getBillingDetails(id: number) {
    try {
      const result = await this.db.findOne({
        where: {
          id,
        },
      });
      if (!result) {
        throw new NotFoundException({
          message: 'Detalle de facturacion no encontrado',
        });
      }
      return result;
    } catch (error) {
      this.logger.error('ERROR AL OBTENER DETALLE DE FACTURACION: ', error);
      throw new Error(error.detail);
    }
  }

  async updateBilling(id: number, updateBillingDto: any) {
    const billing: Billing = await this.db.preload({
      id: id,
      ...updateBillingDto,
    });

    if (!billing) {
      throw new NotFoundException({
        error: 'Facturacion no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(billing);

      await queryRunner.commitTransaction();
      return billing;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }
}
