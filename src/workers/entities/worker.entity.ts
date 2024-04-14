import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractType, DocumentType, EnglishLevel } from '../utils/enum-types';
import { EmergencyContact } from './emergency-contact.entity';
import { Certification } from './certification.entity';

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
    default: DocumentType.DNI,
  })
  documentType: DocumentType; // tipo de documento enum: ['DNI', 'CE', 'PASAPORTE']

  @Expose()
  @Column({ unique: true })
  documentNumber: number; // numero de documento MAX: 9 MIN: 8

  @Expose()
  @Column()
  apPat: string; // apellido paterno

  @Expose()
  @Column()
  apMat: string; // apellido materno

  @Expose()
  @Column()
  name: string; // nombre

  @Expose()
  @Column({
    type: 'enum',
    enum: EnglishLevel,
    default: EnglishLevel.BASIC,
  })
  englishLevel: EnglishLevel; // nivel de ingles enum: [INTERMEDIO, AVANZADO, NATIVO, BASICO]

  @Expose()
  @Column()
  charge: string; // cargo

  @Expose()
  @Column()
  birthdate: string; // fecha de nacimiento

  @Expose()
  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: true,
  })
  contractType: ContractType; // tipo de contrato enum: [CONTRATO POR OBRAS, CONTRATO POR PLANILLA, RECIBO POR HONORARIOS]

  @Expose()
  hiringTime?: string; // tiempo de contratacion

  @Expose()
  @Column({
    type: 'date',
  })
  hiringDate: Date; // fecha de inicio de contrato

  @Expose()
  @Column({ type: 'date', nullable: true })
  leaveDate: Date; // fecha de salida de la empresa

  @Expose()
  @Column()
  phoneNumber: string; // numero de telefono cel o telefono

  @Expose()
  @Column()
  address: string;

  @Expose()
  @Column()
  district: string;

  @Expose()
  @Column()
  province: string;

  @Expose()
  @Column()
  department: string;

  @Expose()
  @OneToMany(
    () => EmergencyContact,
    (emergencyContact) => emergencyContact.worker,
    {
      cascade: true,
    },
  )
  emergencyContacts: EmergencyContact[]; // contacto de emergencia esta es otra entidad

  @Expose()
  @Column()
  familiarAssignment: string;

  @Expose()
  @Column('text', {
    array: true,
    default: [],
  })
  techSkills: string; // string[]

  @Expose()
  @OneToOne(() => Worker, {
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  chiefOfficerId: Worker; // aca vamos a hacer una asignacion circular en bd

  @Expose()
  @OneToMany(() => Certification, (Certification) => Certification.worker, {
    cascade: true,
  })
  certifications: Certification[]; // listado de certificaciones string[]

  @Expose()
  @Column({
    nullable: true,
  })
  resumeUrl: string;

  @Expose()
  @Column({
    nullable: true,
  })
  contractUrl: string;

  @Expose()
  @Column({
    nullable: true,
  })
  psychologicalTestUrl: string;
}
