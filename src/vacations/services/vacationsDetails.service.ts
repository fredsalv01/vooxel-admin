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
  ) { }

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
    console.log("🚀 ~ VacationsDetailsService ~ updateVacationDetailsDto:", typeof updateVacationDetailsDto.items)
    const { newVacDetails, oldVacDetails } = updateVacationDetailsDto.items.reduce((acc, item) => {
      if (item.id) {
        acc.oldVacDetails.push(item);
      } else {
        acc.newVacDetails.push(item);
      }
      return acc;
    }, { newVacDetails: [], oldVacDetails: [] });
    console.log("🚀 ~ VacationsDetailsService ~ newVacDetails:", newVacDetails)
    console.log("🚀 ~ VacationsDetailsService ~ oldVacDetails:", oldVacDetails)


    let vacationHeader = await this.vacationsRepository.getVacationById(vacationId);
    const accumulatedVac = await this.vacationsRepository.calcAccVacationUpdate(vacationHeader);
    vacationHeader.accumulatedVacations = accumulatedVac;
    vacationHeader.remainingVacations = accumulatedVac - vacationHeader.takenVacations;
    // expiracion de vacaciones falta

    let total = 0;

    if (newVacDetails.length) {
      for (const newVacDet of newVacDetails) {
        await this.vacationsDetailsRepository.createVacationDetail({
          vacationId,
          vacationType: newVacDet.vacationType,
          quantity: newVacDet.quantity,
          reason: newVacDet.reason,
          startDate: newVacDet.startDate,
          endDate: newVacDet.endDate,
        });

        if ([VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(newVacDet.vacationType)) {
          total += newVacDet.quantity;
        }
      }
    }

    if (oldVacDetails.length) {
      console.log("🚀 ~ VacationsDetailsService ~ oldVacDetails:", oldVacDetails)

      // total = 0;

      const vacationDetailsBD = await Promise.all(
        oldVacDetails.map(
          async (item) =>
            await this.vacationsDetailsRepository.getVacationDetail(item.id),
        ),
      );
      for await (const oldVacDet of oldVacDetails) {
        await this.vacationsDetailsRepository.updateVacationDetail(oldVacDet.id, oldVacDet);

        if ([VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(oldVacDet.vacationType)) {
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
      vacationHeader.remainingVacations = vacationHeader.accumulatedVacations - total;
      console.log("🚀 ~ VacationsDetailsService ~ vacationHeader:", vacationHeader)

      await this.vacationsRepository.updateVacation(vacationId, {
        accumulatedVacations: vacationHeader.accumulatedVacations,
        takenVacations: vacationHeader.takenVacations,
        remainingVacations: vacationHeader.remainingVacations,
      })
    }

    return true;

    // obtenr primero la vacacion en cuestion
    // const vacationHeader = await this.vacationsRepository.getVacationById(
    //   items[0].vacationId,
    // );



    // filtrar los detalles de vacaciones que se van a actualizar y los que tienen que crearse
    // const vacationDetailsToUpdate = items.filter(
    //   (vacationDetail) => vacationDetail?.id,
    // );

    // const vacationDetailsIdsToUpdate = vacationDetailsToUpdate.map(
    //   (vacationDetail) => vacationDetail.id,
    // );

    // const vacationDetailsToCreate = items.filter(
    //   (vacationDetail) => !vacationDetail.id,
    // );

    // crear los detalles de vacaciones que no existen
    // await Promise.all(
    //   vacationDetailsToCreate.map(
    //     async (vacationDetail) =>
    //       await this.vacationsDetailsRepository.createVacationDetail({
    //         vacationId: vacationHeader.id,
    //         vacationType: vacationDetail.vacationType,
    //         quantity: vacationDetail.quantity,
    //         reason: vacationDetail.reason,
    //         startDate: vacationDetail.startDate,
    //         endDate: vacationDetail.endDate,
    //       } as CreateVacationDetailDto),
    //   ),
    // );

    // // obtener todos los detalles de vacaciones uno por uno mapeandolos
    // const vacationDetailsBD = await Promise.all(
    //   vacationDetailsIdsToUpdate.map(
    //     async (id) =>
    //       await this.vacationsDetailsRepository.getVacationDetail(id),
    //   ),
    // );


    /* 
    
      vacaciones acumuladas = 20; 
      vacaciones tomadas = 15;
      vacaciones pend = 5;

      bd
      d1 = 5
      d2 = 10

      front
      d1 = 4
      d2 = 8 

      dd = 3

      vacaciones acumuladas = 20;
      
      vacaciones tomadas = 15 - (bd - f) = 10;

      vacaciones pend = 12;

    */

    //   for (const   of vacationDetailsIdsToUpdate) {

    //   }

    // const diff = vacationDetailsIdsToUpdate.length 


    // luego actualizar la vacacion con los detalles
    // const updateVacation = vacationDetailsBD.map(async (vacationDetail) => {
    //   if (
    //     vacationDetail.vacationType === VacationDetailType.TOMADAS ||
    //     vacationDetail.vacationType === VacationDetailType.COMPRADAS
    //   ) {
    //     const takenVacations =
    //       vacationHeader.takenVacations - vacationDetail.quantity;

    //     const remainingVacations =
    //       vacationHeader.remainingVacations + vacationDetail.quantity;

    //     // const plannedVacations =
    //     //   vacation.plannedVacations - vacationDetail.quantity;

    //     const expiredDays =
    //       remainingVacations - 30 > 0 ? remainingVacations - 30 : 0;
    //     await this.vacationsRepository.updateVacation(
    //       vacationDetail.vacationId,
    //       {
    //         takenVacations,
    //         remainingVacations,
    //         plannedVacations,
    //         expiredDays,
    //       },
    //     );
    //   }
    // });

    // await Promise.all(updateVacation);

    // // obtener primero el listado de las vacaciones para el id de todas los detalles
    // // y luego actualizar los detalles uno por uno
    // const promises = vacationDetailsToUpdate.map((vacationDetail) => {
    //   return this.vacationsDetailsRepository.updateVacationDetail(
    //     vacationDetail.id,
    //     new VacationDetailItem(vacationDetail),
    //   );
    // });

    // return Promise.all(promises) as unknown as VacationDetailItem[];
  }

  // delete vacation detail
  async deleteVacationDetails(id: number) {
    return this.vacationsDetailsRepository.deleteVacationDetail(id);
  }
}
