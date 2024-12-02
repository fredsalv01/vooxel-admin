import { Injectable, Logger } from '@nestjs/common';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { VacationsRepository } from '../repositories/vacationsRepository';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { VacationDetailType } from '../enum/vacationDetailType';
import { WorkerRepository } from '../../workers/repository/workerRepository';

@Injectable()
export class VacationsService {
  private readonly logger = new Logger(VacationsService.name);
  constructor(
    private readonly vacationsRepository: VacationsRepository,
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  create(createVacationDto: CreateVacationDto) {
    //validar si el worker existe
    return this.vacationsRepository.createVacation(createVacationDto);
  }

  async findAll(workerId: number, update: boolean = true) {
    const result = await this.vacationsRepository.getAllVacations(workerId);
    // actualizar la vacacion con los detalles tambien.
    const vacationDetails =
      await this.vacationsDetailsRepository.getAllVacationDetails(result.id);
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

    if (!update) {
      return result;
    } else {
      await this.update(result.id, {
        takenVacations: takenVacationsUpdate,
        remainingVacations: result.accumulatedVacations - takenVacationsUpdate,
      });

      return result;
    }
  }

  async exportVacations(request: number[]): Promise<any[]> {
    const responseArray: any[] = [];
    for (const id of request) {
      this.logger.log(`Exporting vacation with id: ${id}`);
      const result: any = await this.findAll(id, false);
      const worker: any = await this.workerRepository.getOneWorker(id);
      const workerData = {
        id: worker.id,
        name: worker.name,
        apPat: worker.apPat,
        apMat: worker.apMat,
        email: worker.email,
        documentType: worker.documentType,
        documentNumber: worker.documentNumber,
        clientInfo: worker.clientInfo,
        contractInfo: worker.contractWorkers[0],
        salary: worker.salary,
      };
      result.worker = workerData;
      responseArray.push(result);
    }
    return responseArray;
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
