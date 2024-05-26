import { Module } from '@nestjs/common';
import { ContractWorkersService } from './contract_workers.service';
import { ContractWorkersController } from './contract_workers.controller';
import { ContractWorker } from './entities/contract_worker.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractWorkersRepository } from './repositories/contractWorkersRepository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContractWorker
    ]),
  ],
  controllers: [ContractWorkersController],
  providers: [ContractWorkersService, ContractWorkersRepository],
})
export class ContractWorkersModule {}