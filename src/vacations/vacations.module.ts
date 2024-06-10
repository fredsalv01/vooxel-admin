import { Module } from '@nestjs/common';
import { VacationsService } from './services/vacations.service';
import { VacationsController } from './controllers/vacations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { VacationDetail } from './entities/vacationDetail.entity';
import { VacationsRepository } from './repositories/vacationsRepository';
import { ContractWorkersRepository } from 'src/contract_workers/repositories/contractWorkersRepository';

@Module({
  imports: [TypeOrmModule.forFeature([Vacation, VacationDetail])],
  controllers: [VacationsController],
  providers: [VacationsService, VacationsRepository],
})
export class VacationsModule {}
