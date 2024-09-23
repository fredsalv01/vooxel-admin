import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Billing } from './entities/billing.entity';
import { BillingRepository } from './repository/billingRepository';
import { Service } from './entities/service.entity';
import { BillingServiceRepository } from './repository/billingServiceRepository';
import { BillingServiceService } from './billingService.service';
import { BillingServiceController } from './billingService.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Billing])],
  controllers: [BillingController, BillingServiceController],
  providers: [
    BillingService,
    BillingServiceService,
    BillingRepository,
    BillingServiceRepository,
  ],
})
export class BillingModule {}
