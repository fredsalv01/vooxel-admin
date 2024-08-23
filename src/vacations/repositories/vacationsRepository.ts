import { InjectRepository } from '@nestjs/typeorm';
import { Vacation } from '../entities/vacation.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { DAY } from '../../common/constants';
import { Worker } from '../../workers/entities/worker.entity';
import { VacationDetailType } from '../enum/vacationDetailType';

export class VacationsRepository {
  private readonly logger = new Logger(VacationsRepository.name);
  constructor(
    @InjectRepository(Vacation)
    private readonly db: Repository<Vacation>,
    private readonly dataSource: DataSource,
  ) { }

  // create a new vacation
  async createVacation(vacation: CreateVacationDto): Promise<Vacation> {
    try {
      const worker = await this.dataSource.getRepository('worker').findOne({
        where: { id: vacation.workerId },
        relations: ['vacation'],
      });

      vacation.accumulatedVacations = this.calcVacations(worker.startDate);
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
  async getAllVacations(workerId: number): Promise<Vacation> {
    try {
      const worker = (await this.dataSource.getRepository('worker').findOne({
        where: { id: workerId, vacation: { vacationDetails: { isActive: true } } },
        relations: ['vacation', 'vacation.vacationDetails']
      })) as Worker;

      const accumulatedVacations = this.calcVacations(worker.startDate);
      const expiredDays = Math.floor(accumulatedVacations / 30) * 30;

      if (!worker?.vacation) {
        worker.vacation = await this.createVacation({
          workerId: worker.id,
          accumulatedVacations,
          remainingVacations: accumulatedVacations,
          takenVacations: 0,
          expiredDays,
        } as CreateVacationDto);
      } else {
        const remainingVacations =
          accumulatedVacations - worker.vacation.takenVacations;

        await this.updateVacation(worker.vacation.id, {
          accumulatedVacations,
          remainingVacations,
          expiredDays,
        });

        worker.vacation.accumulatedVacations = accumulatedVacations;
        worker.vacation.remainingVacations = remainingVacations;
        worker.vacation.expiredDays = expiredDays;
      }

      // const filterVacationDetails = worker.vacation.vacationDetails.filter(
      //   (item) =>
      //     item.isActive &&
      //     [VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(
      //       item.vacationType,
      //     ),
      // );

      // console.log(
      //   '🚀 ~ VacationsRepository ~ filterVacationDetails',
      //   filterVacationDetails,
      // );
      // worker.vacation.vacationDetails = filterVacationDetails;
      const result = worker.vacation;

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
      // encontrar la vacacion por vacacionId
      let result = await this.db.findOne({
        where: { id: vacationId },
      });

      const worker = (await this.dataSource.getRepository('worker').findOne({
        where: { id: result.workerId },
        relations: ['vacation'],
        select: {
          vacation: true,
        },
      })) as Worker;

      const accumulatedVacations = this.calcVacations(worker.startDate);
      result.accumulatedVacations = accumulatedVacations;
      result.remainingVacations = accumulatedVacations - result.takenVacations;

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

  public async calcAccVacationUpdate(vacation: Vacation): Promise<number> {
    const worker = (await this.dataSource.getRepository('worker').findOne({
      where: { id: vacation.workerId },
      relations: ['vacation'],
      select: {
        worker: { startDate: true },
      },
    })) as Worker;

    const accumulatedVacationsUpdated = this.calcVacations(worker.startDate);

    return accumulatedVacationsUpdated;
  }

  private calcVacations(startDate: Date) {
    const time = new Date().getTime() - new Date(startDate).getTime();
    // to month
    return Math.floor((time / (30 * DAY)) * 2.5);
  }
}
