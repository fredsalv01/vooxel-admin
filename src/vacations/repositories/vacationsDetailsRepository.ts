import { InjectRepository } from '@nestjs/typeorm';
import { VacationDetail } from '../entities/vacationDetail.entity';
import { DataSource, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { CreateVacationsDetailsDto } from '../dto/create-vacation-detail.dto';
import { Vacation } from '../entities/vacation.entity';
import { Moment } from '../../common/functions';
import moment from 'moment-timezone';

export class VacationsDetailsRepository {
  private readonly logger = new Logger(VacationsDetailsRepository.name);
  constructor(
    @InjectRepository(VacationDetail)
    private readonly db: Repository<VacationDetail>,
    private readonly dataSource: DataSource,
  ) {}

  async createVacationDetail(
    vacationDetail: CreateVacationsDetailsDto,
  ): Promise<VacationDetail> {
    try {
      const newVacationDetail = this.db.create(vacationDetail);

      const result = await this.db.save(newVacationDetail);

      // vacation is type tomadas update the field in vacationId for plannedVacations with the days from startDate to EndDate
      const plannedVacations =
        moment(Moment(vacationDetail?.startDate)).day() -
        moment(Moment(vacationDetail?.endDate)).day();
      const vacationRepository = this.dataSource.getRepository('vacation');

      const vacation = (await vacationRepository.findOne({
        where: {
          id: vacationDetail.vacationId,
        },
      })) as Vacation;

      await vacationRepository.update(
        {
          id: vacationDetail.vacationId,
        },
        {
          plannedVacations,
          takenVacations: plannedVacations,
          remainingVacations: vacation.remainingVacations - plannedVacations,
        },
      );
      this.logger.debug(
        `${this.createVacationDetail.name} - result`,
        JSON.stringify(result, null, 2),
      );

      return result;
    } catch (error) {
      this.logger.error('ERROR GUARDANDO DETALLE DE VACACION:', error);
      throw new Error(error);
    }
  }

  async getVacationDetail(id: number): Promise<VacationDetail> {
    try {
      const vacationDetail = await this.db.findOne({
        where: {
          id: id,
        },
      });
      if (!vacationDetail) {
        throw new Error('Vacation detail not found');
      }
      return vacationDetail;
    } catch (error) {
      this.logger.error('ERROR GETTING VACATION DETAIL:', error);
      throw new Error(error);
    }
  }

  async updateVacationDetail(
    id: number,
    updateVacationDetailDto: any,
  ): Promise<VacationDetail> {
    try {
      const vacationDetail = await this.getVacationDetail(id);
      const updatedVacationDetail = Object.assign(
        vacationDetail,
        updateVacationDetailDto,
      );
      const result = await this.db.save(updatedVacationDetail);
      this.logger.debug(
        `${this.updateVacationDetail.name} - result`,
        JSON.stringify(result, null, 2),
      );
      return result;
    } catch (error) {
      this.logger.error('ERROR UPDATING VACATION DETAIL:', error);
      throw new Error(error);
    }
  }

  async deleteVacationDetail(id: number): Promise<void> {
    try {
      const vacationDetail = await this.getVacationDetail(id);
      await this.db.remove(vacationDetail);
      this.logger.debug('Vacation detail deleted successfully');
    } catch (error) {
      this.logger.error('ERROR DELETING VACATION DETAIL:', error);
      throw new Error(error);
    }
  }

  // get all vacation detail from vacationId
  async getAllVacationDetails(vacationId: number): Promise<VacationDetail[]> {
    try {
      const vacationDetails = await this.db.find({
        where: {
          vacationId: vacationId,
        },
      });
      return vacationDetails;
    } catch (error) {
      this.logger.error('ERROR GETTING ALL VACATION DETAILS:', error);
      throw new Error(error);
    }
  }
}
