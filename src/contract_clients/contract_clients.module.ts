import { Module } from '@nestjs/common';
import { ContractClientsService } from './contract_clients.service';
import { ContractClientsController } from './contract_clients.controller';

@Module({
  controllers: [ContractClientsController],
  providers: [ContractClientsService],
})
export class ContractClientsModule {}
