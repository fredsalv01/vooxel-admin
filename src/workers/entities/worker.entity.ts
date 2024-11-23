import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  DocumentType,
  EnglishLevel,
  Seniority,
  WorkerStatus,
} from '../utils/enum-types';
import { EmergencyContact } from './emergency-contact.entity';
import { Certification } from './certification.entity';
import { BankAccount } from './bank-account.entity';
import { WorkerToClient } from './worker-to-client.entity';
import { ContractWorker } from '../../contract_workers/entities/contract_worker.entity';
import { Vacation } from '../../vacations/entities/vacation.entity';

@Entity()
export class Worker {
  constructor(partial?: Partial<Worker>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: DocumentType,
    default: null,
  })
  documentType: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @Expose()
  @Column({ default: null })
  documentNumber: string; // numero de documento MAX: 9 MIN: 8

  @Expose()
  @Column({
    default: null,
  })
  apPat: string; // apellido paterno

  @Expose()
  @Column({
    default: null,
  })
  apMat: string; // apellido materno

  @Expose()
  @Column({
    default: null,
  })
  name: string; // nombre

  @Expose()
  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: null,
  })
  englishLevel: EnglishLevel; // nivel de ingles enum: [INTERMEDIO, AVANZADO, NATIVO, BASICO]

  @Expose()
  @Column({
    default: null,
  })
  charge: string; // cargo

  @Expose()
  @Column({
    type: 'enum',
    enum: Seniority,
    default: null,
    nullable: true,
  })
  seniority: Seniority;

  @Expose()
  @Column({
    default: null,
  })
  birthdate: string; // fecha de nacimiento

  @Column({
    type: 'date',
    nullable: true,
  })
  @Expose()
  startDate: Date;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  @Expose()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: WorkerStatus,
    default: WorkerStatus.PENDIENTE,
    nullable: true,
  })
  workerStatus: WorkerStatus;

  @Expose()
  @Column({
    default: null,
  })
  phoneNumber: string; // numero de telefono cel o telefono

  @Expose()
  @Column({
    default: null,
  })
  email: string; // numero de telefono cel o telefono

  @Expose()
  @Column({
    default: null,
  })
  salary: number;

  @Expose()
  @Column({
    default: null,
  })
  address: string;

  @Expose()
  @Column({
    default: null,
  })
  district: string;

  @Expose()
  @Column({
    default: null,
  })
  province: string;

  @Expose()
  @Column({
    default: null,
  })
  department: string;

  @OneToMany(
    () => EmergencyContact,
    (emergencyContact) => emergencyContact.worker,
    {
      cascade: true,
      eager: true,
    },
  )
  @Expose()
  emergencyContacts: EmergencyContact[]; // contacto de emergencia esta es otra entidad

  @Expose()
  @Column({
    default: null,
  })
  familiarAssignment: string;

  @Column('text', {
    array: true,
    default: null,
  })
  @Expose()
  techSkills: string[]; // string[]

  @OneToOne(() => Worker, (worker) => worker.chiefOfficer)
  @JoinColumn({
    name: 'chiefOfficerId',
  })
  @Expose()
  chiefOfficer: Worker;

  @Column({
    nullable: true,
    default: null,
  })
  chiefOfficerId: number; // aca vamos a hacer una asignacion circular en bd

  @ManyToMany(() => BankAccount, (bankAccount) => bankAccount.workers)
  @JoinTable()
  @Expose()
  bankAccounts: BankAccount[];

  @OneToMany(() => Certification, (certification) => certification.worker, {
    cascade: true,
    eager: true,
  })
  @Expose()
  certifications: Certification[]; // listado de certificaciones string[]

  @Column({
    type: 'bool',
    default: true,
  })
  @Expose()
  isActive: boolean;

  @OneToMany(() => WorkerToClient, (workerToClient) => workerToClient.worker, {
    cascade: true,
    eager: true,
  })
  @Expose()
  public workerToClients: WorkerToClient[];

  @OneToMany(() => ContractWorker, (contractWorker) => contractWorker.worker)
  public contractWorkers: ContractWorker[];

  @OneToOne(() => Vacation, (vacation) => vacation.worker)
  vacation: Vacation;
}
