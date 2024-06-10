import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from '../../workers/entities/worker.entity';
import { ContractType } from '../enum/enum-contract-types';
import { Expose } from 'class-transformer';
import { Vacation } from '../../vacations/entities/vacation.entity';

@Entity()
export class ContractWorker {
  constructor(partial?: Partial<ContractWorker>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column({
    type: 'date',
  })
  @Expose()
  hiringDate: Date;

  @Column({
    type: 'date',
  })
  @Expose()
  endDate: Date;

  @Column({
    type: 'bool',
    default: true,
  })
  @Expose()
  isActive: Boolean;

  @ManyToOne(() => Worker, (worker) => worker.contractWorkers)
  @JoinColumn({ name: 'workerId' })
  worker: Worker;

  @Column({
    type: 'enum',
    enum: ContractType,
    nullable: true,
    default: null,
  })
  @Expose()
  contractType: ContractType;

  @Column({
    type: 'int',
    nullable: true,
  })
  @Expose()
  workerId: number;

  @OneToOne(() => Vacation, (vacation) => vacation.contractWorker)
  vacation: Vacation;
}
