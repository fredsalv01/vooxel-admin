import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { Worker } from '../workers/entities/worker.entity';
import { EmergencyContact } from '../workers/entities/emergency-contact.entity';
import { Certification } from '../workers/entities/certification.entity';
import { Client } from '../clients/entities/client.entity';
import { BankAccount } from '../workers/entities/bank-account.entity';
import { WorkerToClient } from '../workers/entities/worker-to-client.entity';
import { File } from '../files/entities/files.entity';
import { ContractWorker } from '../contract_workers/entities/contract_worker.entity';
import { ContractClient } from '../contract_clients/entities/contract_client.entity';
import { Vacation } from '../vacations/entities/vacation.entity';
import { VacationDetail } from '../vacations/entities/vacationDetail.entity';
import { Contact } from '../clients/entities/contact.entity';
import { Billing } from './../billing/entities/billing.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      User,
      Client,
      Worker,
      ContractClient,
      WorkerToClient,
      EmergencyContact,
      Contact,
      Certification,
      BankAccount,
      ContractWorker,
      File,
      Vacation,
      VacationDetail,
      Billing,
    ],
    synchronize: true,
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA)),
  }),
);
