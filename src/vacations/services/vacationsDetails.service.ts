import { Injectable } from '@nestjs/common';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { CreateVacationDetailDto } from '../dto/create-vacation-detail.dto';
import { UpdateVacationDetailsDto } from '../dto/update-vacation-details.dto';

@Injectable()
export class VacationsDetailsService {
  constructor(
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
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
    id: number,
    createVacationsDetailsDto: UpdateVacationDetailsDto,
  ) {
    return this.vacationsDetailsRepository.updateVacationDetail(
      id,
      createVacationsDetailsDto,
    );
  }

  // delete vacation detail
  async deleteVacationDetails(id: number) {
    return this.vacationsDetailsRepository.deleteVacationDetail(id);
  }
}
