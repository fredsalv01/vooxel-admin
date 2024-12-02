import { Injectable, Logger } from '@nestjs/common';
import { CreateWorkerDto } from '../dto/create-worker.dto';
import { UpdateWorkerDto } from '../dto/update-worker.dto';
import { WorkerRepository } from '../repository/workerRepository';
import { EmergencyContact } from '../entities/emergency-contact.entity';
import { filterWorkersPaginatedDto } from '../dto/filter-get-workers.dto';
import { WorkerToClientRepository } from '../repository/workerToClientsRepository';
import { FindWorkersResponse } from '../../common/worker-interfaces';

@Injectable()
export class WorkersService {
  private readonly logger = new Logger(WorkersService.name);
  constructor(
    private readonly workerRepository: WorkerRepository,
    private readonly workerToClientsRepository: WorkerToClientRepository,
  ) {}

  async create(createWorkerDto: CreateWorkerDto) {
    this.logger.debug(
      `create worker method - DataToDB ${this.create.name}:`,
      JSON.stringify(createWorkerDto, null, 2),
    );
    const worker = await this.workerRepository.addWorker(createWorkerDto);

    this.logger.debug(
      `DB Response ${this.create.name}:`,
      JSON.stringify(createWorkerDto, null, 2),
    );
    return worker;
  }

  async findAll({ limit, page, ...filters }: filterWorkersPaginatedDto) {
    const filterProperties = { ...filters } as unknown as {
      input?: string;
      isActive?: boolean;
      filters?: WorkerFilters[];
      paginate?: boolean;
    };
    const result = await this.workerRepository.findWorkers({
      limit,
      currentPage: page,
      filters: filterProperties,
    });

    if (filterProperties.paginate) {
      const items = result.items as unknown as FindWorkersResponse[];
      const formatItems = items.map((item) => {
        if (item.emergencyContacts.length > 0) {
          item.emergencyContacts = item.emergencyContacts.map(
            (contact: EmergencyContact) => {
              return {
                id: contact.id,
                name: contact.name,
                phone: contact.phone,
                relation: contact.relation,
              };
            },
          );
        }
        if (item.clientInfo) {
          item.clientInfo = {
            id: item.clientInfo.id,
            businessName: item.clientInfo.businessName,
            ruc: item.clientInfo.ruc,
          };
        }

        return {
          ...item,
          contractType:
            item.contractWorkers?.contractType || 'No tiene contrato',
        };
      });

      return {
        ...result,
        items: formatItems,
      };
    } else {
      const formatItems = result.map((item: any) => {
        if (item.emergencyContacts.length > 0) {
          item.emergencyContacts = item.emergencyContacts.map(
            (contact: EmergencyContact) => {
              return {
                id: contact.id,
                name: contact.name,
                phone: contact.phone,
                relation: contact.relation,
              };
            },
          );
        }
        if (item.clientInfo) {
          item.clientInfo = {
            id: item.clientInfo.id,
            businessName: item.clientInfo.businessName,
            ruc: item.clientInfo.ruc,
          };
        }

        return {
          ...item,
          contractType:
            item.contractWorkers?.contractType || 'No tiene contrato',
        };
      });

      return formatItems;
    }
  }

  findOne(id: number) {
    return this.workerRepository.getOneWorker(id);
  }

  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    const { chiefOfficerId, ...restData } = updateWorkerDto;

    const chiefOfficer =
      await this.workerRepository.getOneWorker(chiefOfficerId);

    if (!chiefOfficer) {
      throw new Error('El jefe de oficina no existe');
    }

    //validar si el row existe para ver si hay actualizacion de cliente o no
    const existsWorkerToClient =
      await this.workerToClientsRepository.validateNewClientForWorker({
        workerId: id,
        clientId: updateWorkerDto.clientId,
      });

    if (!existsWorkerToClient) {
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

  getUniqueValues() {
    return this.workerRepository.getUniqueValues();
  }
}
