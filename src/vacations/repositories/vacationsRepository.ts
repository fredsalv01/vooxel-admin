import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from '../entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ContractWorker } from '../../contract_workers/entities/contract_worker.entity';
import { UpdateVacationDto } from '../dto/update-vacation.dto';

export class VacationsRepository {
  private readonly logger = new Logger(VacationsRepository.name);
  constructor(
    @InjectRepository(Vacation)
    private readonly db: Repository<Vacation>,
    private readonly dataSource: DataSource,
  ) {}

  // create a new vacation
  async createVacation(vacation: CreateVacationDto): Promise<Vacation> {
    try {
      // create planned vacations
      const contractWorker = (await this.dataSource
        .getRepository('contract_worker')
        .findOne({
          where: { id: vacation.contractWorkerId },
          relations: ['worker'],
        })) as ContractWorker;

      console.log('contractWorker', contractWorker);

      if (!contractWorker) {
        throw new NotFoundException({
          error: 'contrato con trabajador no encontrado',
        });
      }

      //vacaciones acumuladas
      if (vacation?.accumulatedVacations === 0 && contractWorker.isActive) {
        // mes actual - mes de inicio de labores del trabajador * 2.5
        vacation.accumulatedVacations = this.calcVacations(
          contractWorker.worker.startDate,
        );
      }

      const newVacation = this.db.create({
        ...vacation,
        remainingVacations:
          vacation.accumulatedVacations - vacation.takenVacations,
      });
      const result = await this.db.save(newVacation);
      this.logger.debug(
        `${this.createVacation.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO VACACION:', error);
      throw new Error(error);
    }
  }

  // get all vacation
  async getAllVacations(workerId: number): Promise<Vacation[]> {
    try {
      // obtener el listado de los id de todos los contratos del trabajador
      const contractWorkers = (await this.dataSource
        .getRepository('contract_worker')
        .find({
          where: { workerId },
          relations: ['vacation'],
          select: {
            vacation: true,
          },
        })) as ContractWorker[];

      const result = contractWorkers.map(
        async (item: ContractWorker): Promise<Vacation> => {
          if (item.vacation.isActive) {
            const accumulatedVacations = await this.calcAccVacationUpdate(
              item.vacation,
            );

            const remainingVacations =
              accumulatedVacations - item.vacation.takenVacations;
            if (
              new Date(item.vacation.updatedAt).getDate() !==
              new Date().getDate()
            ) {
              //actualizar la vacacion
              await this.updateVacation(item.vacation.id, {
                accumulatedVacations,
                remainingVacations,
              });

              item.vacation.accumulatedVacations = accumulatedVacations;
              item.vacation.remainingVacations = remainingVacations;
            }
          }
          return item.vacation;
        },
      );
      const promiseResult = await Promise.all(result);

      this.logger.debug(
        `${this.getAllVacations.name} - result`,
        JSON.stringify(promiseResult, null, 2),
      );

      return promiseResult;
    } catch (error) {
      this.logger.error('ERROR OBTENIENDO VACACIONES:', error);
      throw new Error(error);
    }
  }

  // get a vacation by id
  async getVacationById(vacationId: number): Promise<Vacation> {
    try {
      let result = await this.db.findOne({
        where: { id: vacationId },
      });

      //validate if the updatedat is greater than date now
      if (new Date(result.updatedAt).getDate() === new Date().getDate()) {
        //TODO: MOMENT TZ
        this.logger.debug(
          `${this.getVacationById.name} - result`,
          JSON.stringify(result, null, 2),
        );
        return result;
      }
      const accumulatedVacationsUpdated =
        await this.calcAccVacationUpdate(result);

      // if the accumulated vacations are more than 30, then the expiredDays
      // will be the difference between the accumulated vacations and the taken vacations
      let expiredDaysUpdated = 0;
      if (accumulatedVacationsUpdated >= 30) {
        expiredDaysUpdated =
          accumulatedVacationsUpdated - result.remainingVacations;
      }

      await this.updateVacation(vacationId, {
        accumulatedVacations: accumulatedVacationsUpdated,
        remainingVacations: accumulatedVacationsUpdated - result.takenVacations,
        expiredDays: expiredDaysUpdated,
      } as unknown as any);

      result = await this.db.findOne({
        where: { id: vacationId },
      });
      this.logger.debug(
        `${this.getVacationById.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error('ERROR OBTENIENDO VACACION:', error);
      throw new Error(error);
    }
  }

  // update a vacation
  async updateVacation(
    vacationId: number,
    data: UpdateVacationDto,
  ): Promise<Vacation> {
    const vacation: Vacation = await this.db.preload({
      id: vacationId,
      ...data,
    });

    if (!vacation) {
      throw new NotFoundException({
        error: 'Vacacion no encontrada',
      });
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(vacation);

      await queryRunner.commitTransaction();
      return vacation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }

  async deleteVacation(vacationId: number): Promise<Vacation> {
    const vacation = await this.db.findOne({
      where: { id: vacationId },
    });

    if (!vacation) {
      throw new NotFoundException({
        error: 'Vacacion no encontrada',
      });
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.softDelete(Vacation, vacationId);

      await queryRunner.commitTransaction();
      return vacation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      throw new BadRequestException(error?.detail);
    } finally {
      await queryRunner.release();
    }
  }

  private async calcAccVacationUpdate(vacation: Vacation): Promise<number> {
    const contractWorker = (await this.dataSource
      .getRepository('contract_worker')
      .findOne({
        where: { id: vacation.contractWorkerId },
        relations: ['worker', 'vacation'],
        select: {
          worker: { startDate: true },
        },
      })) as ContractWorker;

    const accumulatedVacationsUpdated = this.calcVacations(
      contractWorker.worker.startDate,
    );

    return accumulatedVacationsUpdated;
  }

  private calcVacations(startDate: Date) {
    return Math.floor(
      (new Date(startDate).getMonth() - new Date().getMonth() +1) * 2.5, 
    );
  }
}


