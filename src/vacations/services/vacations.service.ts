import { Injectable, Logger } from '@nestjs/common';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { VacationsRepository } from '../repositories/vacationsRepository';

@Injectable()
export class VacationsService {
  private readonly logger = new Logger(VacationsService.name);
  constructor(private readonly vacationsRepository: VacationsRepository) {}

  create(createVacationDto: CreateVacationDto) {
    //validar si el worker existe
    return this.vacationsRepository.createVacation(createVacationDto);
  }

  findAll(workerId: number) {
    return this.vacationsRepository.getAllVacations(workerId);
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
