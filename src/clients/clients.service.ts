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
      `create worker method - DataToDB ${this.create.name}:`,
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
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
