import { Injectable } from '@nestjs/common';
import { VacationsDetailsRepository } from '../repositories/vacationsDetailsRepository';
import { CreateVacationsDetailsDto } from '../dto/create-vacation-detail.dto';

@Injectable()
export class VacationsDetailsService {
  constructor(
    private readonly vacationsDetailsRepository: VacationsDetailsRepository,
  ) {}

  // create a new vacation detail
  async createVacationDetail(
    createVacationsDetailsDto: CreateVacationsDetailsDto,
  ) {
    return this.vacationsDetailsRepository.createVacationDetail(
      createVacationsDetailsDto,
    );
  }

  // get all vacation details
  async getAllVacationDetails() {
    // get all vacation details
  }

  // get vacation detail by id
  async getVacationDetailById(id: number) {
    return this.vacationsDetailsRepository.getVacationDetail(id);
  }

  // update vacation detail
  async updateVacationDetails() {
    // update vacation detail
  }

  // delete vacation detail
  async deleteVacationDetails() {
    // delete vacation detail
  }
}
