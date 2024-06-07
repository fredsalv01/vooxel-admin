import { Injectable, Logger } from '@nestjs/common';
import { CreateVacationDto } from '../dto/create-vacation.dto';
import { UpdateVacationDto } from '../dto/update-vacation.dto';
import { VacationsRepository } from '../repositories/vacationsRepository';

@Injectable()
export class VacationsService {
  private readonly logger = new Logger(VacationsService.name);
  constructor(private readonly vacationsRepository: VacationsRepository) {}

  create(createVacationDto: CreateVacationDto) {
    return this.vacationsRepository.createVacation(createVacationDto);
  }

  findAll(contractWorkerId: number) {
    return this.vacationsRepository.getAllVacations(contractWorkerId);
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
