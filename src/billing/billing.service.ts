import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingRepository } from './repository/billingRepository';
import { Filter, filterBillingPaginatedDto } from './dto/filter-get-billing.dto';
import { BillingServiceRepository } from './repository/billingServiceRepository';
import { ClientRepository } from "../clients/repository/clientRepository";
import { Months } from "../common/enums";
import { BillingCurrencyType } from './enum';
const moment = require('moment-timezone');
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
    // operaciones de conversion de datos
    return this.billingRepository.createBilling(restData, service, client);
  }

  async findAll({ limit, page, ...filters }: filterBillingPaginatedDto) {
    const filterProperties = { ...filters } as unknown as { input: string, filters: Filter[] };
    const data = await this.billingRepository.getBillingList({
      limit,
      currentPage: page,
      Dtofilters: filterProperties,
    });

    const { items, ...restPaginationData } = data;

    const mapResponseItems = data.items.map((item) => {
      const { service, client, ...restData } = item;
      return {
        ...restData,
        serviceName: service.name,
        client: client.businessName,
        clientRuc: client.ruc
      };
    });

    return { items: mapResponseItems, ...restPaginationData };
  }

  async findOne(id: number) {
    return await this.billingRepository.getBillingDetails(id);
  }

  async update(id: number, updateBillingDto: UpdateBillingDto) {
    
    const billing = await this.billingRepository.getBillingDetails(id);
    

    if(updateBillingDto.state2) {
      billing.state2 = updateBillingDto.state2;
    }

    if (updateBillingDto.depositDate) {
      updateBillingDto.depositDate = moment(updateBillingDto.depositDate).format('YYYY-MM-DD');
      updateBillingDto.depositMonth = Months[moment(updateBillingDto.depositDate).format('MMMM').toUpperCase()];
    }
    
    if (updateBillingDto.depositDate2) {
      updateBillingDto.depositDate2 = moment(updateBillingDto.depositDate2).format('YYYY-MM-DD');
      updateBillingDto.depositMonth2 = Months[moment(updateBillingDto.depositDate2).format('MMMM').toUpperCase()];
    }

    if (updateBillingDto.depositAmountDollars && billing.currency === BillingCurrencyType.DOLARES) {
      updateBillingDto.depositAmountDollars = updateBillingDto.depositAmountDollars;
      updateBillingDto.depositAmountSoles = updateBillingDto.depositAmountDollars * billing.conversionRate;
    } else if (updateBillingDto.depositAmountSoles && billing.currency === BillingCurrencyType.SOLES) {
      updateBillingDto.depositAmountSoles = updateBillingDto.depositAmountSoles;
      updateBillingDto.depositAmountDollars = updateBillingDto.depositAmountSoles / billing.conversionRate;
    }
    
    if (updateBillingDto.depositAmountDollars2 && billing.currency === BillingCurrencyType.DOLARES) {
      updateBillingDto.depositAmountDollars2 = updateBillingDto.depositAmountDollars2;
      updateBillingDto.depositAmountSoles2 = updateBillingDto.depositAmountDollars2 * billing.conversionRate;
    } else if (updateBillingDto.depositAmountSoles2 && billing.currency === BillingCurrencyType.SOLES) {
      updateBillingDto.depositAmountSoles2 = updateBillingDto.depositAmountSoles2;
      updateBillingDto.depositAmountDollars2 = updateBillingDto.depositAmountSoles2 / billing.conversionRate;
    }

    return await this.billingRepository.updateBilling(id, updateBillingDto);
  }

  remove(id: number) {
    return `This action removes a #${id} billing`;
  }
}
