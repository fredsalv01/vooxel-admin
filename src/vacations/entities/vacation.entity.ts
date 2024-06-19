import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VacationDetail } from './vacationDetail.entity';
import { ContractWorker } from '../../contract_workers/entities/contract_worker.entity';

@Entity('vacations')
export class Vacation {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column('int', { nullable: false, default: 0 })
  plannedVacations: number;

  @Column('int', { nullable: false, default: 0 })
  accumulatedVacations: number; // este se va a actualizar (vacaciones acumuladas)

  @Column('int', { nullable: false, default: 0 })
  takenVacations: number; // este se va a actualizar  (vacaciones tomadas)

  @Column('int', { nullable: false, default: 0 })
  remainingVacations: number; // este se va a actualizar (vacaciones pendientes)

  @Column('int', { nullable: false, default: 0 })
  expiredDays: number; // este se va a actualizar (dias vencidos)

  @OneToOne(() => ContractWorker, (contractWorker) => contractWorker.vacation)
  @JoinColumn({ name: 'contractWorkerId' })
  contractWorker: ContractWorker;

  @Column('int', { nullable: false })
  contractWorkerId: number;

  @OneToMany(() => VacationDetail, (vacationDetail) => vacationDetail.vacation)
  vacationDetails: VacationDetail[];

  @Column({
    type: 'bool',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
