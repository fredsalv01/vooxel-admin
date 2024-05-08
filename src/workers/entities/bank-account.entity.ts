import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BankNames } from '../utils/enum-types';
import { Worker } from './worker.entity';

@Entity()
export class BankAccount {
  constructor(partial?: Partial<BankAccount>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('increment')
  @Expose()
  id: number;

  @Column({
    type: 'enum',
    enum: BankNames,
    default: null,
    nullable: true,
  })
  @Expose()
  bankName: BankNames;

  @Column({
    type: 'bigint',
    default: null,
    nullable: true,
  })
  @Expose()
  cci: number; // tiene 20 digitos

  @Column({
    type: 'bigint',
    default: null,
    nullable: true,
  })
  @Expose()
  bankAccountNumber: number;

  @OneToOne(() => Worker, (worker) => worker.bankAccount)
  @JoinColumn({
    name: 'workerId',
  })
  @Expose()
  worker: Worker;

  @Column({
    type: 'int',
    nullable: true,
    default: null,
  })
  @Expose()
  workerId: number;
}
