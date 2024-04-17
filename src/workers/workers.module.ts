import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersController } from './workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { Certification } from './entities/certification.entity';
import { WorkerRepository } from './repository/workerRepository';
import { EmergencyContactRepository } from './repository/emergencyContactRepository';
import { EmergencyContactService } from './services/emergency-contact.service';
import { EmergencyContactsController } from './controllers/emergency-contacts.controller';
import { WorkerDoesNotExistsConstrint } from './validation/worker-does-not-exists.constraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([Worker, EmergencyContact, Certification]),
  ],
  controllers: [WorkersController, EmergencyContactsController],
  providers: [
    WorkersService,
    EmergencyContactService,
    WorkerRepository,
    EmergencyContactRepository,
    WorkerDoesNotExistsConstrint
  ],
})
export class WorkersModule {}
