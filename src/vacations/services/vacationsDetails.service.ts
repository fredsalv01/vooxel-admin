import { Injectable } from '@nestjs/common';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { CreateVacationDetailDto } from '../dto/create-vacation-detail.dto';
import { UpdateVacationDetailsDto } from '../dto/update-vacation-details.dto';
import { VacationDetailItem } from '../classes/VacationDetailItem';
import { VacationsRepository } from '../repositories/vacationsRepository';
import { VacationDetailType } from '../enum/vacationDetailType';

@Injectable()
export class VacationsDetailsService {
  constructor(
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
    private readonly vacationsRepository: VacationsRepository,
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
  ) {
    const items = updateVacationDetailsDto.items;
    // obtenr primero la vacacion en cuestion
    const vacation = await this.vacationsRepository.getVacationById(
      items[0].vacationId,
    );

    // filtrar los detalles de vacaciones que se van a actualizar y los que tienen que crearse
    const vacationDetailsToUpdate = items.filter(
      (vacationDetail) => vacationDetail?.id,
    );

    const vacationDetailsIdsToUpdate = vacationDetailsToUpdate.map(
      (vacationDetail) => vacationDetail.id,
    );

    const vacationDetailsToCreate = items.filter(
      (vacationDetail) => !vacationDetail.id,
    );

    // crear los detalles de vacaciones que no existen
    const createdVacationDetails = await Promise.all(
      vacationDetailsToCreate.map(
        async (vacationDetail) =>
          await this.vacationsDetailsRepository.createVacationDetail({
            vacationId: vacation.id,
            vacationType: vacationDetail.vacationType,
            quantity: vacationDetail.quantity,
            reason: vacationDetail.reason,
            startDate: vacationDetail.startDate,
            endDate: vacationDetail.endDate,
          } as CreateVacationDetailDto),
      ),
    );

    // obtener todos los detalles de vacaciones uno por uno mapeandolos
    const vacationDetails = await Promise.all(
      vacationDetailsIdsToUpdate.map(
        async (id) =>
          await this.vacationsDetailsRepository.getVacationDetail(id),
      ),
    );

    // luego actualizar la vacacion con los detalles
    const updateVacation = vacationDetails.map(async (vacationDetail) => {
      if (
        vacationDetail.vacationType === VacationDetailType.TOMADAS ||
        vacationDetail.vacationType === VacationDetailType.COMPRADAS
      ) {
        const takenVacations =
          vacation.takenVacations - vacationDetail.quantity;
        const remainingVacations =
          vacation.remainingVacations + vacationDetail.quantity;
        const plannedVacations =
          vacation.plannedVacations - vacationDetail.quantity;
        const expiredDays =
          remainingVacations - 30 > 0 ? remainingVacations - 30 : 0;
        await this.vacationsRepository.updateVacation(
          vacationDetail.vacationId,
          {
            takenVacations,
            remainingVacations,
            plannedVacations,
            expiredDays,
          },
        );
      }
    });

    await Promise.all(updateVacation);

    // obtener primero el listado de las vacaciones para el id de todas los detalles
    // y luego actualizar los detalles uno por uno
    const promises = vacationDetailsToUpdate.map((vacationDetail) => {
      return this.vacationsDetailsRepository.updateVacationDetail(
        vacationDetail.id,
        new VacationDetailItem(vacationDetail),
      );
    });

    return Promise.all(promises) as unknown as VacationDetailItem[];
  }

  // delete vacation detail
  async deleteVacationDetails(id: number) {
    return this.vacationsDetailsRepository.deleteVacationDetail(id);
  }
}
