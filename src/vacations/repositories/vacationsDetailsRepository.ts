import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VacationDetail } from '../entities/vacationDetail.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateVacationDetailDto } from '../dto/create-vacation-detail.dto';
import { Vacation } from '../entities/vacation.entity';
import { VacationDetailType } from '../enum/vacationDetailType';
import { VacationDetailItem } from '../classes/VacationDetailItem';
import { Moment } from '../../common/functions';
const moment = require('moment-timezone');

export class VacationsDetailsRepository {
  private readonly logger = new Logger(VacationsDetailsRepository.name);
  constructor(
    @InjectRepository(VacationDetail)
    private readonly db: Repository<VacationDetail>,
    private readonly dataSource: DataSource,
  ) { }

  async createVacationDetail(
    createVacationDetailDto: CreateVacationDetailDto,
  ): Promise<VacationDetail> {
    try {
      await this.updateVacation(
        createVacationDetailDto.vacationId,
        createVacationDetailDto.vacationType,
        createVacationDetailDto.quantity,
      );

      const result = await this.db.save(createVacationDetailDto);
      // compradas todo pasa a ser 0 y la vacacion se actualiza

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
    VacationDetailItem: VacationDetailItem,
  ): Promise<VacationDetail> {
    try {
      const vacationDetail = await this.getVacationDetail(id);

      if (
        (vacationDetail.vacationType === VacationDetailType.TOMADAS ||
          vacationDetail.vacationType === VacationDetailType.COMPRADAS) &&
        VacationDetailItem.vacationType === VacationDetailType.PENDIENTES
      ) {
        throw new Error('No se puede cambiar de tomada o comprada a pendiente');
      }

      const updatedVacationDetail = Object.assign(
        vacationDetail,
        VacationDetailItem,
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
      const vacationDetails = (await this.db.find({
        where: {
          vacationId: vacationId,
        },
      })) as VacationDetail[];

      // actualizar el estado de los detalles de vacaiones tomadas en caso ya hayan expirado
      const currentDate = Moment(new Date().toISOString());

      console.log('currentDate', Moment(new Date().toISOString()));
      vacationDetails.forEach(async (vacationDetail) => {
        if (
          vacationDetail.endDate &&
          moment(vacationDetail.endDate).isBefore(currentDate)
        ) {
          await this.db.update(
            {
              id: vacationDetail.id,
            },
            {
              isActive: false,
            },
          );
        }
      });

      this.logger.debug(
        `${this.getAllVacationDetails.name} - vacationDetails`,
        JSON.stringify(vacationDetails, null, 2),
      );

      return vacationDetails;
    } catch (error) {
      this.logger.error('ERROR GETTING ALL VACATION DETAILS:', error);
      throw new Error(error);
    }
  }

  public async updateVacation(
    vacationId: number,
    vacationType: VacationDetailType,
    quantity: number,
  ) {
    console.log('entro acatualizar vacacion');
    const vacationRepository = this.dataSource.getRepository('vacations');
    const vacation = (await vacationRepository.findOne({
      where: {
        id: vacationId,
      },
    })) as Vacation;

    if (!vacation) {
      throw new Error('No se encontro vacacionId');
    }

    if (
      (vacationType === VacationDetailType.TOMADAS ||
        vacationType === VacationDetailType.COMPRADAS) &&
      quantity > 0
    ) {
      await vacationRepository.update(
        {
          id: vacationId,
        },
        {
          takenVacations: vacation.takenVacations + quantity,
          remainingVacations: vacation.remainingVacations - quantity,
        },
      );
    }
  }
}
