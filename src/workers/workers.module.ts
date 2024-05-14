import { Module } from '@nestjs/common';
import { WorkersService } from './services/workers.service';
import { WorkersController } from './controllers/workers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { EmergencyContact } from './entities/emergency-contact.entity';
import { Certification } from './entities/certification.entity';
import { WorkerRepository } from './repository/workerRepository';
import { EmergencyContactRepository } from './repository/emergencyContactRepository';
import { EmergencyContactService } from './services/emergency-contact.service';
import { EmergencyContactsController } from './controllers/emergency-contacts.controller';
import { CertificationController } from './controllers/certifications.controller';
import { CertificationsService } from './services/certifications.service';
import { CertificationRepository } from './repository/certificationRepository';
import { BankAccount } from './entities/bank-account.entity';
import { WorkerToClient } from './entities/worker-to-client.entity';
// import { WorkerDoesNotExistsConstrint } from './validation/worker-does-not-exists.constraint';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Worker,
      EmergencyContact,
      Certification,
      BankAccount,
      WorkerToClient
    ]),
  ],
  controllers: [
    WorkersController,
    EmergencyContactsController,
    CertificationController,
  ],
  providers: [
    WorkersService,
    EmergencyContactService,
    CertificationsService,
    WorkerRepository,
    EmergencyContactRepository,
    CertificationRepository,
    // WorkerDoesNotExistsConstrint
  ],
})
export class WorkersModule {}
