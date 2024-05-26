import { Expose } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BankAccountTypes, BankNames } from '../utils/enum-types';
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
    type: 'text',
    default: null,
    nullable: true,
  })
  @Expose()
  cci: string; // tiene 20 digitos

  @Column({
    type: 'text',
    default: null,
    nullable: true,
  })
  @Expose()
  bankAccountNumber: string;

  @Column({
    type: 'enum',
    enum: BankAccountTypes,
    default: null,
    nullable: true,
  })
  @Expose()
  AccountType: BankAccountTypes;

  @Column({
    type: 'bool',
    default: true,
  })
  @Expose()
  isActive: boolean;

  @ManyToMany(() => Worker, (worker) => worker.bankAccounts)
  @Expose()
  workers: Worker[];
}
