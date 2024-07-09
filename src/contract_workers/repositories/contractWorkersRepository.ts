import { InjectRepository } from '@nestjs/typeorm';
import { ContractWorker } from '../entities/contract_worker.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { VacationDetail } from '../../vacations/entities/vacationDetail.entity';
import { Vacation } from '../../vacations/entities/vacation.entity';
const moment = require('moment-timezone');

export class ContractWorkersRepository {
  private readonly logger = new Logger(ContractWorkersRepository.name);

  constructor(
    @InjectRepository(ContractWorker)
    private readonly db: Repository<ContractWorker>,
    private readonly dataSource: DataSource,
  ) {}

  private getContractsBaseQuery(): SelectQueryBuilder<ContractWorker> {
    return this.db
      .createQueryBuilder('contract')
      .orderBy('contract.id', 'DESC');
  }

  async createContract(data: any) {
    try {
      // si tiene un contrato antiguo desactivarlo
      const vacationRepository = this.dataSource.getRepository('vacations');
      const vacationDetailRepository = this.dataSource
        .getRepository('vacation_details')
        .createQueryBuilder();

      const previousContract = await this.db.findOne({
        where: {
          workerId: data.workerId,
          isActive: true,
        },
        relations: {
          worker: true,
          vacation: true,
        },
        order: {
          id: 'desc',
        },
      });

      let result: ContractWorker;
      if (previousContract) {
        await this.updateContract(previousContract.id, {
          isActive: false,
        });
        // desactivar las vacaciones
        if (previousContract.vacation) {
          await vacationRepository.update(
            {
              id: previousContract.vacation.id,
            },
            {
              isActive: false,
            },
          );

          if (
            previousContract?.vacation?.vacationDetails &&
            previousContract?.vacation?.vacationDetails.length > 0
          ) {
            await vacationDetailRepository
              .update(VacationDetail)
              .set({ isActive: false })
              .where({ vacationId: previousContract.vacation.id })
              .execute();
          }

          // si es mas de un año desde el inicio del trabajador
          // calcular dias vencidos
          let expiredDays = 0;
          if (
            moment(previousContract.worker.startDate).year() - moment().year() >
            1
          ) {
            expiredDays = previousContract?.vacation?.remainingVacations - 30;
          }

          result = await this.db.save(
            new ContractWorker({
              ...data,
            }),
          );

          // create vacation from result id
          // aca no se toman en cuenta las vacaciones tomadas, porque quedan con el contrato anterior
          // lo unico que importa son las vacaciones pendientes, las vacaciones acumuladas y dias vencidos
          const vacation = new Vacation({
            contractWorkerId: result.id,
            expiredDays: expiredDays >= 0 ? expiredDays : 0,
            accumulatedVacations:
              previousContract?.vacation?.accumulatedVacations,
            remainingVacations: previousContract?.vacation?.remainingVacations,
          });
          await vacationRepository.save(vacation);
        } else {
          result = await this.db.save(
            new ContractWorker({
              ...data,
            }),
          );
          const vacation = new Vacation({
            contractWorkerId: result.id,
            expiredDays: 0,
            accumulatedVacations: 0,
            remainingVacations: 0,
            takenVacations: 0,
            plannedVacations: 0,
          });
          await vacationRepository.save(vacation);
        }
      } else {
        result = await this.db.save(data);
      }

      this.logger.debug(
        `${this.createContract.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO CONTRATO DE TRABAJADOR:', error);
      throw new Error(error);
    }
  }

  async getLatestContractByWorkerId(workerId: number) {
    const result = await this.db
      .createQueryBuilder('contract')
      .orderBy('contract.id', 'DESC')
      .where('contract.workerId = :workerId', { workerId })
      .andWhere('contract.isActive = :isActive', { isActive: true })
      .select([
        'contract.id',
        'contract.hiringDate',
        'contract.endDate',
        'contract.workerId',
        'contract.isActive',
      ])
      .getOne();

    const file = await this.dataSource.getRepository('File').findOne({
      where: {
        table_name: 'contractWorkers',
        tag: 'contract',
        tableId: result.id,
      },
    });

    result['file'] = file || 'No se ha subido contrato';

    this.logger.debug(
      `${this.getLatestContractByWorkerId.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async getAllContracts(workerId: number) {
    const result = await this.db.find({
      where: {
        workerId,
      },
    });

    //obtener el file del contrato por id de contrato
    for (const contract of result) {
      const file = await this.dataSource.getRepository('File').findOne({
        where: {
          table_name: 'contractWorkers',
          tag: 'contract',
          tableId: contract.id,
        },
      });

      contract['file'] = file || 'No se ha subido contrato';
    }

    this.logger.debug(
      `${this.getAllContracts.name} - result`,
      JSON.stringify(result, null, 2),
    );

    return result;
  }

  async updateContract(id: number, updateContractWorker: any) {
    const contract: ContractWorker = await this.db.preload({
      id: id,
      ...updateContractWorker,
    });

    if (!contract) {
      throw new NotFoundException({
        error: 'Colaborador no encontrado',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(contract);

      await queryRunner.commitTransaction();
      return contract;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }
}
