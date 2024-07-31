import { Injectable, Logger } from '@nestjs/common';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { VacationsRepository } from '../repositories/vacationsRepository';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { VacationDetailType } from '../enum/vacationDetailType';

@Injectable()
export class VacationsService {
  private readonly logger = new Logger(VacationsService.name);
  constructor(
    private readonly vacationsRepository: VacationsRepository,
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
  ) {}

  create(createVacationDto: CreateVacationDto) {
    //validar si el worker existe
    return this.vacationsRepository.createVacation(createVacationDto);
  }

  async findAll(workerId: number) {
    const result = await this.vacationsRepository.getAllVacations(workerId);

    // actualizar la vacacion con los detalles tambien.
    const vacationDetails = await this.vacationsDetailsRepository.getAllVacationDetails(result.id);
    const filterActiveVacationDetails = vacationDetails.filter(
      (vacationDetail) =>
        vacationDetail.isActive &&
        [VacationDetailType.TOMADAS, VacationDetailType.COMPRADAS].includes(
          vacationDetail.vacationType,
        ),
    );

    const takenVacationsUpdate = filterActiveVacationDetails.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );

    await this.update(result.id, {
      takenVacations: takenVacationsUpdate,
      remainingVacations: result.accumulatedVacations - takenVacationsUpdate,
    });

    return result;
  }

  findOne(id: number) {
    return this.vacationsRepository.getVacationById(id);
  }

  update(id: number, updateVacationDto: UpdateVacationDto) {
    return this.vacationsRepository.updateVacation(id, updateVacationDto);
  }

  remove(id: number) {
    return this.vacationsRepository.deleteVacation(id);
  }
}
