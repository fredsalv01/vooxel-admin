import { Injectable } from '@nestjs/common';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { CreateVacationDetailDto } from '../dto/create-vacation-detail.dto';
import { UpdateVacationDetailsDto } from '../dto/update-vacation-details.dto';
import { VacationDetailItem } from '../classes/VacationDetailItem';
import { VacationsRepository } from '../repositories/vacationsRepository';
import { VacationDetailType } from '../enum/vacationDetailType';
import { VacationsService } from './vacations.service';

@Injectable()
export class VacationsDetailsService {
  constructor(
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
    private readonly vacationsRepository: VacationsRepository,
    private readonly vacationService: VacationsService
  ) {}

  // create a new vacation detail
  async createVacationDetail(
    createVacationsDetailsDto: CreateVacationDetailDto,
  ) {
    return this.vacationsDetailsRepository.createVacationDetail(
      createVacationsDetailsDto,
    );
  }

  // get all vacation details
  async getAllVacationDetails(vacationId: number) {
    return this.vacationsDetailsRepository.getAllVacationDetails(vacationId);
  }

  // get vacation detail by id
  async getVacationDetailById(id: number) {
    return this.vacationsDetailsRepository.getVacationDetail(id);
  }

  // update vacation detail
  async updateVacationDetails(
    updateVacationDetailsDto: UpdateVacationDetailsDto,
    vacationId: number,
  ) {
    const { newVacDetails, oldVacDetails } =
      updateVacationDetailsDto.items.reduce(
        (acc, item) => {
          if (item.id) {
            acc.oldVacDetails.push(item);
          } else {
            acc.newVacDetails.push(item);
          }
          return acc;
        },
        { newVacDetails: [], oldVacDetails: [] },
      );

    let vacationHeader =
      await this.vacationsRepository.getVacationById(vacationId);
    let total = 0;

    if (newVacDetails.length) {
      for (const newVacDet of newVacDetails) {
        const newVaction =
          await this.vacationsDetailsRepository.createVacationDetail({
            vacationId,
            vacationType: newVacDet.vacationType,
            quantity: newVacDet.quantity,
            reason: newVacDet.reason,
            startDate: newVacDet.startDate,
            endDate: newVacDet.endDate,
          });
        console.log(
          '🚀 ~ VacationsDetailsService ~ forawait ~ newVaction:',
          newVaction,
        );

        if (
          [VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(
            newVacDet.vacationType,
          )
        ) {
          total += newVacDet.quantity;
        }
      }
    }

    if (oldVacDetails.length) {
      console.log(
        '🚀 ~ VacationsDetailsService ~ oldVacDetails:',
        oldVacDetails,
      );
      const vacationDetailsBD = await Promise.all(
        oldVacDetails.map(
          async (item) =>
            await this.vacationsDetailsRepository.getVacationDetail(item.id),
        ),
      );
      for (const oldVacDet of oldVacDetails) {
        await this.vacationsDetailsRepository.updateVacationDetail(
          oldVacDet.id,
          oldVacDet,
        );

        if (
          [VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(
            oldVacDet.vacationType,
          )
        ) {
          for (const vacDetailBD of vacationDetailsBD) {
            if (vacDetailBD.id === oldVacDet.id) {
              total += oldVacDet.quantity;
            }
          }
        }
      }
    }

    if (total) {
      vacationHeader.takenVacations = total;
      vacationHeader.remainingVacations =
        vacationHeader.accumulatedVacations - total;
      console.log(
        '🚀 ~ VacationsDetailsService ~ vacationHeader:',
        vacationHeader,
      );

      await this.vacationsRepository.updateVacation(vacationId, {
        accumulatedVacations: vacationHeader.accumulatedVacations,
        takenVacations: vacationHeader.takenVacations,
        remainingVacations: vacationHeader.remainingVacations,
      });
    }

    return vacationHeader.workerId;
  }

  // delete vacation detail
  async deleteVacationDetails(id: number) {
    const vacationDetail =
      await this.vacationsDetailsRepository.getVacationDetail(id);
    const vacation = await this.vacationsRepository.getVacationById(
      vacationDetail.vacationId,
    );
    await this.vacationsDetailsRepository.deleteVacationDetail(id);

    const updatedVacations = await this.vacationsRepository.updateVacation(
      vacation.id,
      {
        accumulatedVacations: 0,
        takenVacations: 0,
        remainingVacations: 0,
        expiredDays: 0,
        plannedVacations: 0,
      },
    );

    if (updatedVacations) {
      return await this.vacationService.findAll(vacation.workerId);
    } else {
      return false;
    }
  }
}
