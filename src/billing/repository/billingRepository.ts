import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Billing } from '../entities/billing.entity';
import { DataSource, Repository } from 'typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { CreateBillingDto } from '../dto/create-billing.dto';
import { Service } from '../entities/service.entity';
import { Client } from '../../clients/entities/client.entity';
import * as moment from 'moment-timezone';
import { Console } from 'console';

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

  async createBilling(data: any, service: Service, client: Client) {
    try {
      console.log('data', data);
      const billing = this.db.create({
        ...data,
        service,
        client,
      });
      console.log('billing', billing);
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

  async getBillingList({ limit, currentPage, Dtofilters }) {
    this.logger.log('VALIDATE FILTERS', Dtofilters);

    const qb = this.getBillingBaseQuery();
    const { input, ...filters } = Dtofilters;
    console.log('input🚀', input);
    console.log('filters', filters);
    qb.leftJoinAndSelect('billing.service', 'service');
    qb.leftJoinAndSelect('billing.client', 'client');
    if (input) {
      const fieldsToSearch = [
        'CAST(billing.documentType AS TEXT)',
        'CAST(billing.documentNumber AS TEXT)',
        'CAST(billing.purchaseOrderNumber AS TEXT)',
        'CAST(billing.currency AS TEXT)',
        'CAST(billing.billingState AS TEXT)',
        'CAST(billing.hes AS TEXT)',
        'CAST(service.name AS TEXT)',
        'CAST(client.businessName AS TEXT)',
      ];
      qb.andWhere(`CONCAT_WS('', ${fieldsToSearch.join(',')}) ILIKE :input`, {
        input: `%${input}%`,
      });
    }

    if (filters) {
      const { dates, ...restFilters } = filters;
      console.log('restFilters', restFilters);
      for (const [key, value] of Object.entries(restFilters)) {
        if (value) {
          let property = key;
          switch (property) {
            case 'state':
              property = 'billing.billingState';
              break;
            case 'service':
              property = 'service.name';
              break;
            case 'client':
              property = 'client.businessName';
              break;
            default:
              property = `billing.${key}`;
              break;
          }
          qb.andWhere(`${property} IN (:...${key})`, {
            [key]: typeof value === 'string' ? [value] : value,
          });
        }
      }

      if (dates) {
        dates.forEach((date: any) => {
          // si no hay data ingresada en el campo de fechas
          // se toma el mes actual
          if (!date.start_date && !date.end_date) {
            const start_date = moment().startOf('month').format('YYYY-MM-DD');
            const end_date = moment().endOf('month').format('YYYY-MM-DD');
            qb.andWhere(
              `billing
                ."${date.column}" BETWEEN :start_date AND :end_date`,
              {
                start_date,
                end_date,
              },
            );
          } else if (date.start_date && date.end_date) {
            qb.andWhere(
              `billing
                ."${date.column}" BETWEEN :start_date AND :end_date`,
              {
                start_date: date.start_date,
                end_date: date.end_date,
              },
            );
          } else if (date.start_date && !date.end_date) {
            qb.andWhere(
              `billing
                ."${date.column}" >= :start_date`,
              {
                start_date: date.start_date,
              },
            );
          } else if (!date.start_date && date.end_date) {
            qb.andWhere(
              `billing
                ."${date.column}" <= :end_date`,
              {
                end_date: date.end_date,
              },
            );
          }
        });
      }
      // if (filter.order) {
      //   qb.orderBy(`billing.${filter.order.column}`, filter.order.direction);
      // }
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
    // return response;
  }

  async getBillingDetails(id: number) {
    try {
      const result = await this.db.findOne({
        where: {
          id,
        },
        relations: {
          service: true,
          client: true,
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

  async getUniqueValues() {
    try {
      const qbCurrency = this.db.createQueryBuilder('billing')
            .select('billing.currency')
            .distinct(true);

        const qbBillingState = this.db.createQueryBuilder('billing')
            .select('billing.billingState')
            .distinct(true);

        const qbServiceName = this.db.createQueryBuilder('billing')
            .leftJoin('billing.service', 'service')
            .select('service.name')
            .distinct(true);

        const qbClientBusinessName = this.db.createQueryBuilder('billing')
            .leftJoin('billing.client', 'client')
            .select('client.businessName')
            .distinct(true);

        const [currencies, billingStates, serviceNames, clientBusinessNames] = await Promise.all([
            qbCurrency.getRawMany(),
            qbBillingState.getRawMany(),
            qbServiceName.getRawMany(),
            qbClientBusinessName.getRawMany(),
        ]);

        return {
            currencies: currencies.map(item => item.billing_currency),
            billingStates: billingStates.map(item => item.billing_billingState),
            serviceNames: serviceNames.map(item => item.service_name),
            clientBusinessNames: clientBusinessNames.map(item => item.client_businessName),
        };
    } catch (error) {
      this.logger.error(
        'ERROR AL OBTENER VALORES UNICOS DE FACTURACION: ',
        error,
      );
      throw new Error(error.detail);
    }
  }
}
