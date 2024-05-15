import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContact } from './emergency-contact.entity';
import { Certification } from './certification.entity';
import { Client } from '../../clients/entities/client.entity';
import { BankAccount } from './bank-account.entity';
import { WorkerToClient } from './worker-to-client.entity';

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
    default: null,
  })
  birthdate: string; // fecha de nacimiento

  @Expose()
  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: true,
    default: null,
  })
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]

  @Expose()
  hiringTime?: number; // tiempo de contratacion

  @Expose()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  hiringDate: Date; // fecha de inicio de contrato

  @Expose()
  @Column({ type: 'date', nullable: true, default: null })
  leaveDate: Date; // fecha de salida de la empresa

  @Expose()
  @Column({
    default: null,
  })
  phoneNumber: string; // numero de telefono cel o telefono

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

  @OneToOne(() => BankAccount, (bankAccount) => bankAccount.worker)
  @Expose()
  bankAccount: BankAccount;

  @OneToMany(() => Certification, (certification) => certification.worker, {
    cascade: true,
    eager: true,
  })
  @Expose()
  certifications: Certification[]; // listado de certificaciones string[]

  @Expose()
  @Column({
    nullable: true,
    default: null,
  })
  resumeUrl: string;

  @Expose()
  @Column({
    nullable: true,
    default: null,
  })
  contractUrl: string;

  @Expose()
  @Column({
    nullable: true,
    default: null,
  })
  psychologicalTestUrl: string;

  @Expose()
  vacationDays?: number; // virtual property se genera en el backend

  @Expose()
  usedVacationDays?: number; // virtual property

  @Expose()
  truncatedVacations?: number;

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

  getHiringTime(): number {
    const currentTime = new Date();
    const hiringTimeMs = currentTime.getTime() - this.hiringDate.getTime();
    // Convertir de milisegundos a días
    return hiringTimeMs / (1000 * 3600 * 24);
  }
}
