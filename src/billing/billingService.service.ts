import { BadRequestException, Injectable } from '@nestjs/common';
import { BillingServiceRepository } from './repository/billingServiceRepository';
import { CreateBillingServiceDto } from './dto/create-billing-service.dto';

@Injectable()
export class BillingServiceService {
  constructor(
    private readonly billingServiceRepository: BillingServiceRepository,
  ) {}

  async create(data: CreateBillingServiceDto) {
    let service = await this.billingServiceRepository.findOneByName(data.name);
    if (!service) {
      service = await this.billingServiceRepository.create(data);
    } else {
      throw new BadRequestException(
        `El servicio con nombre ${data.name} ya existe.`,
      );
    }

    return service;
  }

  async findAll() {
    const result = await this.billingServiceRepository.list();
    return result;
  }
}
