import { Module } from '@nestjs/common';
import { VacationsService } from './services/vacations.service';
import { VacationsController } from './controllers/vacations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacation } from './entities/vacation.entity';
import { VacationDetail } from './entities/vacationDetail.entity';
import { VacationsRepository } from './repositories/vacationsRepository';
import { VacationsDetailsService } from './services/vacationsDetails.service';
import { VacationsDetailsRepository } from './repositories/vacationsDetailsRepository';
import { VacationDetailsController } from './controllers/vacation-details.controller';
import { WorkersModule } from '../workers/workers.module';
import { WorkerRepository } from '../workers/repository/workerRepository';
import { Worker } from '../workers/entities/worker.entity';

@Module({
  imports: [
    WorkersModule,
    TypeOrmModule.forFeature([Vacation, VacationDetail, Worker]),
  ],
  controllers: [VacationsController, VacationDetailsController],
  providers: [
    WorkerRepository,
    VacationsService,
    VacationsRepository,
    VacationsDetailsService,
    VacationsDetailsRepository,
  ],
})
export class VacationsModule {}
