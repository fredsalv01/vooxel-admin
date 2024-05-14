import { Injectable, Logger } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './repository/clientRepository';
import { filterClientsPaginatedDto } from './dto/filter-client-paginated.dto';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(private readonly clientRepository: ClientRepository) {}

  create(createClientDto: CreateClientDto) {
    this.logger.debug(
      `create client method - DataToDB ${this.create.name}:`,
      JSON.stringify(createClientDto, null, 2),
    );
    return this.clientRepository.addClient(createClientDto);
  }

  findAll({ limit, page, ...filters }: filterClientsPaginatedDto) {
    const filterProperties = { ...filters } as unknown as any;
    console.log(filterProperties);
    return this.clientRepository.findAll({
      limit,
      currentPage: page,
      filters: filterProperties,
    });
  }

  findOne(id: number) {
    return this.clientRepository.findOne(id);
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    this.logger.debug(
      `update client method - DataToDB ${this.create.name}:`,
      JSON.stringify(updateClientDto, null, 2),
    );
    return this.clientRepository.updateOne(id, updateClientDto);
  }

  remove(id: number) {
    return this.clientRepository.deleteOne(id);
  }
}
