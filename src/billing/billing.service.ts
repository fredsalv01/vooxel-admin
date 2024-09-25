import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingRepository } from './repository/billingRepository';
import { filterBillingPaginatedDto } from './dto/filter-get-billing.dto';
import { BillingServiceRepository } from './repository/billingServiceRepository';
import { ClientRepository } from "../clients/repository/clientRepository";

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(
    private readonly billingRepository: BillingRepository,
    private readonly billingServiceRepository: BillingServiceRepository,
    private readonly clientRepository: ClientRepository
  ) {}

  async create(createBillingDto: CreateBillingDto) {
    const { serviceId, clientId,  ...restData } = createBillingDto;
    const service = await this.billingServiceRepository.findOneById(serviceId);
    const client = await this.clientRepository.findOne(clientId);
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }
    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }
    
    return this.billingRepository.createBilling(restData, service, client);
  }

  async findAll({ limit, page, ...filters }: filterBillingPaginatedDto) {
    const filterProperties = { ...filters } as unknown as any;
    const data = await this.billingRepository.getBillingList({
      limit,
      currentPage: page,
      filters: filterProperties,
    });

    const { items, ...restPaginationData } = data;

    const mapResponseItems = data.items.map((item) => {
      const { service, client, ...restData } = item;
      return {
        ...restData,
        serviceName: service.name,
        client: client.businessName
      };
    });

    return { items: mapResponseItems, ...restPaginationData };
  }

  async findOne(id: number) {
    return await this.billingRepository.getBillingDetails(id);
  }

  async update(id: number, updateBillingDto: UpdateBillingDto) {
    return await this.billingRepository.updateBilling(id, updateBillingDto);
  }

  remove(id: number) {
    return `This action removes a #${id} billing`;
  }
}
