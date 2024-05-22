import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { WorkerRepository } from '../repository/workerRepository';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { filterWorkersPaginatedDto } from '../dto/filter-get-workers.dto';
import { WorkerToClientRepository } from '../repository/workerToClientsRepository';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);
  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly emergencyContactService: EmergencyContactService,
    private readonly workerToClientsRepository: WorkerToClientRepository,
  ) {}

  async create(createWorkerDto: CreateWorkerDto) {
    this.logger.debug(
      `create worker method - DataToDB ${this.create.name}:`,
      JSON.stringify(createWorkerDto, null, 2),
    );
    const worker = await this.workerRepository.addWorker(createWorkerDto);
    let emergencyContactArray: any[] = [];
    // if (
    //   createWorkerDto?.emergencyContacts &&
    //   createWorkerDto?.emergencyContacts.length > 0
    // ) {
    //   for (
    //     let index = 0;
    //     index < createWorkerDto.emergencyContacts.length;
    //     index++
    //   ) {
    //     const element = createWorkerDto.emergencyContacts[index];
    //     const data = { ...element, workerId: worker?.id };
    //     const emergencyContact = await this.emergencyContactService.create(
    //       new EmergencyContact(data),
    //     );
    //     emergencyContactArray.push(emergencyContact);
    //   }
    //   worker.emergencyContacts = emergencyContactArray;
    // }

    this.logger.debug(
      `DB Response ${this.create.name}:`,
      JSON.stringify(createWorkerDto, null, 2),
    );
    return worker;
  }

  async findAll({ limit, page, ...filters }: filterWorkersPaginatedDto) {
    const filterProperties = { ...filters } as unknown as any;
    return this.workerRepository.findWorkers({
      limit,
      currentPage: page,
      filters: filterProperties,
    });
  }

  findOne(id: number) {
    return this.workerRepository.getOneWorker(id);
  }

  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    const formatData = {
      ...updateWorkerDto,
    };
    console.log('formatData', formatData);
    // validar que tenga certificaciones y contactos de emergencia
    // if (
    //   !updateWorkerDto.certifications &&
    //   !(updateWorkerDto.certifications.length > 0)
    // ) {
    //   throw new BadRequestException({
    //     error: 'No ha agregado ninguna certificacion',
    //   });
    // }

    // if (
    //   !updateWorkerDto.emergencyContacts &&
    //   !(updateWorkerDto.emergencyContacts.length > 0)
    // ) {
    //   throw new BadRequestException({
    //     error: 'No ha agregado ningun contacto de emergencia',
    //   });
    // }

    if (!updateWorkerDto.bankAccount) {
      throw new BadRequestException({
        error: 'No se ha agregado ninguna cuenta bancaria',
      });
    }

    //validar si el row existe para ver si hay actualizacion de cliente o no
    const existsWorkerToClient =
      this.workerToClientsRepository.validateNewClientForWorker({
        workerId: id,
        clientId: updateWorkerDto.clientId,
      });

    if (existsWorkerToClient) {
      await this.workerToClientsRepository.create({
        workerId: id,
        clientId: updateWorkerDto.clientId,
      });
    }

    return this.workerRepository.updateWorker(id, updateWorkerDto);
  }

  remove(id: number) {
    return this.workerRepository.updateWorker(id, { isActive: false });
  }
}
