import { Module } from '@nestjs/common';
import { ContractClientsService } from './contract_clients.service';
import { ContractClientsController } from './contract_clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractClient } from './entities/contract_client.entity';
import { ContractClientsRepository } from './repository/contractClientsRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContractClient])
  ],
  controllers: [ContractClientsController],
  providers: [ContractClientsService, ContractClientsRepository],
})
export class ContractClientsModule {}
