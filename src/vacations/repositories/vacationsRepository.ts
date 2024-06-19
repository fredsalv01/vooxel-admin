import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from '../entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { ContractWorker } from '../../contract_workers/entities/contract_worker.entity';

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
      if (vacation?.accumulatedVacations === 0) {
        // mes actual - mes de inicio de labores del trabajador * 2.5
        const accumulatedVacations =
          (new Date(contractWorker.worker.startDate).getMonth() -
            new Date().getMonth()) *
          2.5;

        // redondear a entero mas bajo
        vacation.accumulatedVacations = Math.floor(accumulatedVacations);

        console.log('accumulatedVacations', accumulatedVacations);
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
  async getAllVacations(contractWorkerId: number): Promise<Vacation[]> {
    try {
      const result = await this.db.find({
        where: { contractWorkerId },
        order: { id: 'DESC' },
        relations: ['vacation_details'],
      });
      this.logger.debug(
        `${this.getAllVacations.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
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

      // if (result.expiredDays > 0) {
      //   // return result;
      //TODO: notificar que la persona ya tiene dias vencidos
      // }

      //get the worker start date
      const contractWorker = (await this.dataSource
        .getRepository('contract_worker')
        .findOne({
          where: { id: result.contractWorkerId },
          relations: ['worker'],
          select: {
            worker: { startDate: true },
          },
        })) as ContractWorker;

      const accumulatedVacationsUpdated = Math.floor(
        (new Date(contractWorker.worker.startDate).getMonth() -
          new Date().getMonth()) *
          2.5,
      );

      // if the accumulated vacations are more than 30, then the expiredDays
      //will be the difference between the accumulated vacations and the taken vacations
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
  async updateVacation(vacationId: number, data: any): Promise<Vacation> {
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
}
