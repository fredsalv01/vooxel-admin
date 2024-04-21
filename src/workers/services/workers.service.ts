import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { WorkerRepository } from '../repository/workerRepository';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { PaginationDto } from '../../pagination/dto/pagination.dto';
import { filter } from 'rxjs';
import { filterWorkersPaginatedDto } from '../dto/filter-get-workers.dto';
import { SearchCriteria } from '../interfaces/searchCriteria';

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

  async findAll({ limit, page, ...filters }: filterWorkersPaginatedDto) {
    const filterProperties = { ...filters } as unknown as any;
    // Verificar si la propiedad techSkills existe en el objeto filters
    if (filters.hasOwnProperty('techSkills')) {
      // Si existe, convertir el string en un array
      filterProperties.techSkills = filters.techSkills
        .split(',')
        .map((data) => data.toUpperCase());
    } else {
      // Si no existe, asignar un array vacío como valor por defecto
      filterProperties.techSkills = [];
    }
    // return this.workerRepository.getWorkersWithHiringTime();
    return this.workerRepository.findWorkers({
      limit,
      currentPage: page,
      filters: filterProperties,
    });
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
