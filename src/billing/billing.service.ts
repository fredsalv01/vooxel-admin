import { Injectable, Logger } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { BillingRepository } from './repository/billingRepository';
import { filterBillingPaginatedDto } from './dto/filter-get-billing.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);
  constructor(private readonly billingRepository: BillingRepository) {}

  async create(createBillingDto: CreateBillingDto) {
    return this.billingRepository.createBilling(createBillingDto);
  }

  async findAll({ limit, page, ...filters }: filterBillingPaginatedDto) {
    const filterProperties = { ...filters } as unknown as any;
    return this.billingRepository.getBillingList({
      limit,
      currentPage: page,
      filters: filterProperties,
    });
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
