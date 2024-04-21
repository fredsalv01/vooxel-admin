import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { WorkerRepository } from '../repository/workerRepository';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { PaginationDto } from '../../pagination/dto/pagination.dto';

@Injectable()
export class WorkersService {
  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  async create(createWorkerDto: CreateWorkerDto) {
    const worker = await this.workerRepository.addWorker(createWorkerDto);
    let emergencyContactArray: any[] = [];
    if (createWorkerDto.emergencyContacts.length > 0) {
      for (
        let index = 0;
        index < createWorkerDto.emergencyContacts.length;
        index++
      ) {
        const element = createWorkerDto.emergencyContacts[index];
        const data = { ...element, workerId: worker?.id };
        const emergencyContact = await this.emergencyContactService.create(
          new EmergencyContact(data),
        );
        emergencyContactArray.push(emergencyContact);
      }
      worker.emergencyContacts = emergencyContactArray;
    }
    return worker;
  }

  async findAll({ limit, page }: PaginationDto) {
    // return this.workerRepository.getWorkersWithHiringTime();
    return this.workerRepository.findWorkers({ limit, currentPage: page });
  }

  findOne(id: number) {
    return this.workerRepository.getOneWorker(id);
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return `This action updates a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
