import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { WorkerRepository } from '../repository/workerRepository';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { filterWorkersPaginatedDto } from '../dto/filter-get-workers.dto';
import { Certification } from '../entities/certification.entity';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);
  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  async create(createWorkerDto: CreateWorkerDto) {
    this.logger.debug(
      `create worker method - DataToDB ${this.create.name}:`,
      JSON.stringify(createWorkerDto, null, 2),
    );
    const worker = await this.workerRepository.addWorker(createWorkerDto);
    let emergencyContactArray: any[] = [];
    if (
      createWorkerDto?.emergencyContacts &&
      createWorkerDto?.emergencyContacts.length > 0
    ) {
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

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    const formatData = {
      ...updateWorkerDto,
    };
    console.log('formatData', formatData);
    // validar que tenga certificaciones y contactos de emergencia
    if (
      !updateWorkerDto.certifications &&
      !(updateWorkerDto.certifications.length > 0)
    ) {
      throw new BadRequestException({
        error: 'No ha agregado ninguna certificacion',
      });
    }

    if (
      !updateWorkerDto.emergencyContacts &&
      !(updateWorkerDto.emergencyContacts.length > 0)
    ) {
      throw new BadRequestException({
        error: 'No ha agregado ningun contacto de emergencia',
      });
    }

    if (!updateWorkerDto.bankAccount) {
      throw new BadRequestException({
        error: 'No se ha agregado ninguna cuenta bancaria',
      });
    }

    // mapeando certificaciones y contactos de emergencia para ese worker
    const certifications = updateWorkerDto.certifications.map(
      (item) => new Certification({ ...item }),
    );
    const emergencyContacts = updateWorkerDto.emergencyContacts.map(
      (item) => new EmergencyContact({ ...item }),
    );
    console.log('certifications', certifications);
    console.log('emergencyContacts', emergencyContacts);
    formatData.certifications = certifications;
    formatData.emergencyContacts = emergencyContacts;
    return this.workerRepository.updateWorker(id, updateWorkerDto);
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
