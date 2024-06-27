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
import { Expose } from 'class-transformer';

@Entity('vacations')
export class Vacation {
  constructor(partial?: Partial<Vacation>) {
    Object.assign(this, partial);
  }

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
  expiredDays: number; // este se va a actualizar (dias vencidos: vacaciones que no se tomaron en el año anterior)

  @OneToOne(() => ContractWorker, (contractWorker) => contractWorker.vacation)
  @JoinColumn({ name: 'contractWorkerId' })
  contractWorker: ContractWorker;

  @Column('int', { nullable: false })
  contractWorkerId: number;

  @OneToMany(
    () => VacationDetail,
    (vacationDetail) => vacationDetail.vacation,
    {
      cascade: true,
      eager: true,
    },
  )
  @Expose()
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
